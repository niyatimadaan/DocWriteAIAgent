import sys
import json
import threading
from flask import Flask, request, jsonify
from llama_index.llms.ollama import Ollama
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader, Document
from llama_index.core.embeddings import resolve_embed_model
from llama_index.core.tools import QueryEngineTool, ToolMetadata
from llama_index.core.agent import ReActAgent
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from llama_parse import LlamaParse
import os
import time
import concurrent.futures

load_dotenv()

app = Flask(__name__)

llm = Ollama(model="mistral", request_timeout=120.0)
document_data = None
query_engine = None
agent = None
last_thought = None

# Custom parser for HTML and text files
class CustomParser:
    def __init__(self, result_type="markdown"):
        self.result_type = result_type

    def parse_html_string(self, html_string):
        soup = BeautifulSoup(html_string, 'lxml')
        return soup.get_text()

parser = CustomParser(result_type="markdown")

@app.route('/load_document', methods=['POST'])
def load_document():
    global document_data, query_engine, agent

    html_text = request.json.get('htmlText')
    file_path = request.json.get('filePath')

    if html_text:
        parserll = LlamaParse(result_type="markdown")
        document_content = parser.parse_html_string(html_text)
        documents = [Document(text=document_content)]
    elif file_path:
        documents = SimpleDirectoryReader(input_files=[file_path]).load_data()
    else:
        return jsonify({"error": "No HTML text or file path provided"}), 400
    
    # Debugging: Ensure documents are loaded correctly
    if not documents or not all(doc for doc in documents):
        return jsonify({"error": "Document content is empty"}), 400
    
    print(f"Loaded {len(documents)} documents")

    try:
        embed_model = resolve_embed_model("local:BAAI/bge-m3")
        vector_index = VectorStoreIndex.from_documents(documents, embed_model=embed_model)
    except ValueError as e:
        return jsonify({"error": str(e)}), 500
    except Exception as e:
        # Catch all exceptions to log detailed error information
        print(f"Unexpected error during embedding model loading: {e}", file=sys.stderr)
        return jsonify({"error": f"Unexpected error: {str(e)}"}), 500

    query_engine = vector_index.as_query_engine(llm=llm)

    tools = [
        QueryEngineTool(
            query_engine=query_engine,
            metadata=ToolMetadata(
                name="chatbot",
                description="this provides answers based on the content of the provided HTML document",
            ),
        ),
    ]

    try:
        agent = ReActAgent.from_tools(tools, llm=llm, verbose=True)
    except Exception as e:
        print(f"Failed to initialize ReActAgent: {e}", file=sys.stderr)
        return jsonify({"error": f"Failed to initialize ReActAgent: {str(e)}"}), 500

    return jsonify({"status": "Document loaded successfully"}), 200

def query_agent(question, result_container, stop_event):
    global agent, last_thought

    iterations = 0
    max_iterations = 4
    start_time = time.time()
    max_time = 50  # maximum time in seconds
    
    while iterations < max_iterations and not stop_event.is_set():
        try:
            result = agent.query(question)
            print(f"In while loop Result: {result}")
            last_thought = result
            result_container['result'] = result
            return  # exit once result is obtained
        except Exception as e:
            print(f"Error occurred during query: {str(e)}", file=sys.stderr)
            result_container['error'] = str(e)
        
        iterations += 1
        print(f"In while loop : Iteration {iterations} completed")
        # last_thought = f"Error occurred during query: {str(e)}"
        if time.time() - start_time > max_time:
            print("Timeout occurred")
            break

@app.route('/ask_question', methods=['POST'])
def ask_question():
    global last_thought

    if agent is None:
        return jsonify({"error": "Document not loaded"}), 400

    question = request.json.get('question')
    if not question:
        return jsonify({"error": "No question provided"}), 400
    print(f"Received question: {question}")

    res =  query_engine.query(question)
    print(f"Query result: {res}")
    return jsonify({"answer": str(res)}), 200


if __name__ == "__main__":
    # app.run(port=5000) # For running on localhost
    app.run(host="0.0.0.0", port=5000) # For running on Docker container
