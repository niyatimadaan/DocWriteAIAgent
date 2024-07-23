import sys
import json
import threading
from flask import Flask, request, jsonify
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader, Document
from llama_index.core.embeddings import resolve_embed_model
from llama_index.core.tools import QueryEngineTool, ToolMetadata
from llama_index.core.agent import ReActAgent
from bs4 import BeautifulSoup
from dotenv import load_dotenv
import os
import time
import requests

load_dotenv()

app = Flask(__name__)

# Load Hugging Face API Key from environment variables
HF_API_KEY = os.getenv('HF_API_KEY')
HF_API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-Nemo-Instruct-2407"  # Replace with the model you prefer

headers = {
    "Authorization": f"Bearer {HF_API_KEY}"
}

document_content = None
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
    global document_content

    html_text = request.json.get('htmlText')
    file_path = request.json.get('filePath')

    if html_text:
        document_content = parser.parse_html_string(html_text)
    elif file_path:
        documents = SimpleDirectoryReader(input_files=[file_path]).load_data()
        if documents:
            document_content = documents[0].text  # Assuming single document for simplicity
        else:
            return jsonify({"error": "Document content is empty"}), 400
    else:
        return jsonify({"error": "No HTML text or file path provided"}), 400
    
    print(f"Loaded document with content length: {len(document_content)}")
    return jsonify({"status": "Document loaded successfully"}), 200

@app.route('/ask_question', methods=['POST'])
def ask_question():
    global document_content

    if document_content is None:
        return jsonify({"error": "Document not loaded"}), 400

    question = request.json.get('question')
    if not question:
        return jsonify({"error": "No question provided"}), 400

    print(f"Received question: {question}")

    # Concatenate document content with the question for context
    input_text = f"Context: {document_content}\n\nQuestion: {question}"

    try:
        response = requests.post(
            HF_API_URL,
            headers=headers,
            json={"inputs": input_text}
        )
        response.raise_for_status()
        res = response.json()
        answer = res[0]['generated_text']
    except Exception as e:
        print(f"Error occurred during query: {str(e)}", file=sys.stderr)
        return jsonify({"error": f"Error occurred during query: {str(e)}"}), 500

    print(f"Query result: {answer}")
    return jsonify({"answer": answer}), 200

if __name__ == "__main__":
    # app.run(port=5000) # For running on localhost
    app.run(host="0.0.0.0", port=5000) # For running on Docker container