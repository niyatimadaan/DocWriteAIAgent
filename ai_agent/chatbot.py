# chatbot.py
import sys
import json
from flask import Flask, request, jsonify
from llama_index.llms.ollama import Ollama
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.core.embeddings import resolve_embed_model
from llama_index.core.tools import QueryEngineTool, ToolMetadata
from llama_index.core.agent import ReActAgent
from bs4 import BeautifulSoup
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

llm = Ollama(model="mistral", request_timeout=30.0)
document_data = None
query_engine = None
agent = None

# Custom parser for HTML and text files
class CustomParser:
    def __init__(self, result_type="markdown"):
        self.result_type = result_type

    def parse(self, file_path):
        with open(file_path, 'r', encoding='utf-8') as file:
            if file_path.endswith('.html'):
                soup = BeautifulSoup(file, 'lxml')
                return soup.get_text()
            else:
                return file.read()

parser = CustomParser(result_type="markdown")
file_extractor = {".html": parser, ".txt": parser}  # Add any other file extensions you need

@app.route('/load_document', methods=['POST'])
def load_document():
    global document_data, query_engine, agent

    file_path = request.json.get('filePath')
    documents = SimpleDirectoryReader(file_path, file_extractor=file_extractor).load_data()

    embed_model = resolve_embed_model("local:BAAI/bge-m3")
    vector_index = VectorStoreIndex.from_documents(documents, embed_model=embed_model)
    query_engine = vector_index.as_query_engine(llm=llm)

    tools = [
        QueryEngineTool(
            query_engine=query_engine,
            metadata=ToolMetadata(
                name="api_documentation",
                description="this provides answers based on the content of the provided HTML document",
            ),
        ),
    ]

    agent = ReActAgent.from_tools(tools, llm=llm, verbose=True)

    return jsonify({"status": "Document loaded successfully"}), 200

@app.route('/ask_question', methods=['POST'])
def ask_question():
    global agent

    if agent is None:
        return jsonify({"error": "Document not loaded"}), 400

    question = request.json.get('question')
    try:
        result = agent.query(question)
        return jsonify({"answer": result}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000)
