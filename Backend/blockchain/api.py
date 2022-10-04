import json
from flask import Flask, jsonify, request
from uuid import uuid4
from urllib.parse import urlparse
#import requests
from blockchain import Blockchain

# Instance the Node
app = Flask(__name__)

# Generate a globally unique address for this node
node_identifier = str(uuid4()).replace('-', '')

# Instance the Blockchain
blockchain = Blockchain()


@app.route('/chain', methods = ["GET"])
def full_chain():

    response = {
        'chain': blockchain.chain,
        "length": len(blockchain.chain),
        "nodes":  list(blockchain.nodes)

    }
    return jsonify(response), 200

@app.route('/transactions/new', methods = ["POST"])
def new_transaction():
      values = request.get_json()

      if not values:
          return "Missing body", 400

      required = ["sender", "recipient", "amount"]

      if not all(k in values for k in required):
          return "Missing values", 400

      index = blockchain.new_transaction(values["sender"], values["recipient"], values["amount"])

      response = { "message": f"Transaction will be added to block {index}"}
      return jsonify(response), 201

@app.route('/mine', methods = ["GET"])
def mine():
    # Add mining reward
    # Sender "0" means new coins
    blockchain.new_transaction(
        sender = "0",
        recipient = node_identifier,
        amount = 1
    )

    #Make the new block and mine it
    block = blockchain.new_block(0)
    blockchain.proof_of_work(block)

    response = {
        "message": "New block mined",
        "index": block["index"],
        "transactions": block["transactions"],
        "proof": block["proof"],
        "previous_hash": block["previous_hash"]
    }
    return jsonify(response), 200

@app.route('/nodes/register', methods = ["POST"])
def register_nodes():
    values = request.get_json()
    nodes = values.get('nodes')
    
    if nodes is None:
        return "Error: Please supply a valid list of nodes", 400
    
    for node in nodes:
        blockchain.register_node(node)
        
    response = {'message': 'New nodes have been added',
    'total_nodes': list(blockchain.nodes)
    }
    return jsonify(response), 201

@app.route("/nodes/resolve", methods=["GET"])
def consensus():
    replaced = blockchain.resolve_conflict()
    print (replaced, "replaced")
    if replaced:
        response = {
            'message': "Our chain was replaced",
            'new chain': blockchain.chain
        }
    else:
        response = {
            'message': "Our chain is authoritative",
            'chain': blockchain.chain
        }
    return jsonify(response), 200


if __name__=="__main__":
    app.run(host='0.0.0.0', port=5000)

    blockchain.new_transaction("Alice", "Bob", 50)
    #blockchain.new_block(0)
    blockchain.new_transaction("Jean", "Cody", 199)
    blockchain.new_block(0)
    print(blockchain.chain)

    

   
