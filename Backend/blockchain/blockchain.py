import hashlib
import json
from flask import Flask, jsonify, request
from sqlite3 import TimestampFromTicks
from time import time


class Blockchain(object):
    def __init__(self):
        self.chain = []
        self.pending_transactions = []
        # Create the Genesis block
        self.genesis_block()
        #self.new_block(previous_hash = '1', proof = 100)
        
        
    def genesis_block(self):
        timestamp = time()
        current_hash = self.hash2(timestamp, 1, [])

        block = {
            'index'         : 1,
            'timestamp'     : timestamp,
            'transactions'  : [],
            'proof'         : 100,
            'previous_hash' : '0000',
            'myhash'         : current_hash
        }
        self.chain.append(block)

            
    def new_block(self, proof, previous_hash = None):
        """
        # Create a new Block and adds it to the chain
        :param proof: <int> The proof given by the Proof of Work Alogrithm
        :param previous_hash: (Optional) <str> Hash of the previous block
        :return: <dict> New Block
        """
        timestamp = time()
        prev_hash = self.chain[-1]["myhash"]

        current_hash = self.hash2(timestamp, prev_hash, self.pending_transactions)
        
        block = {
            'index'         : len(self.chain) + 1,
            'timestamp'     : timestamp,
            'transactions'  : self.pending_transactions,
            'proof'         : proof,
            'previous_hash' : prev_hash,
            'myhash'        : current_hash
        }
        # Reset the current list of transactions
        self.pending_transactions = []

        self.chain.append(block)
        return block

    
    def new_transaction(self, sender, recipient, amount):
        """
        Creates a new transaction to go into the next mined block
        :param sender:  <str> Address of the Sender
        :param recipient: <str> Address of the Recipient
        :param amount:  <int> Amount
        :return <int> the index of the Block that will hold tis transaction

        """
        self.pending_transactions.append({
            "sender"    :   sender,
            "recipient" :   recipient,
            "amount"    :   amount
        })
        return self.last_block['index'] + 1
    

    @staticmethod
    def hash2(*args):
        """
        Creates a SHA-256 hash for a new Block, not genesis
        :param usually: timestamp, previous_hash, self.pending_transactions
        :return: <str>
        """
        # Hashes a block
        # We must make sure that the args are ordered, or we will have inconsistent hashes
        stringifiedargs = sorted(map(lambda data: json.dumps(data), args))
        #print(f'stringified_args: {stringifiedargs}')
        joined_data = ''.join(stringifiedargs)
        #print(f'joined_data: {joined_data}')
        return hashlib.sha256(joined_data.encode('utf-8')).hexdigest()
    
    
    @staticmethod
    def hash(block):
        """
        JM - I've replaced this with hash2 - keeping it around just in case
        Creates a SHA-256 hash of a Block
        :param block: <dict> Block
        :return: <str>
        """
        # Hashes a block
        # We must make sure that the Dictionary is ordered, or we will have inconsistent hashes
        block_string = json.dumps(block, sort_keys = True).encode()
        return hashlib.sha256(block_string).hexdigest()
    
    
    @staticmethod
    def proof_of_work(block):
        """
        Proof-of-Work algorithm
        Iterate the "proof" field until the conditions are satisfied
        :param block: <dict>
        """
        while not Blockchain.valid_proof(block):
            block["proof"] += 1

    @staticmethod
    def valid_proof(block):
        """
        The Proof-of-Work conditions
        Check if the hash of the block starts with 4 zeroes
        higher difficulty == more zeroes, lover difficulty == fewer zeroes
        :param block: <dict>
        """
        return Blockchain.hash2(block)[:4] == "0000"

    @property
    def last_block(self):
        # Returns the last Block in the chain
        return self.chain[-1]
    
if __name__=="__main__":
    #app = Flask(__name__)

    #app.run(host='0.0.0.0', port=5000)

    blockchain = Blockchain()      
    #print(blockchain.chain)
    #print(blockchain.hash(blockchain.last_block))

    blockchain.new_transaction("Alice", "Bob", 50)
    #blockchain.new_block(0)
    blockchain.new_transaction("Jean", "Cody", 199)
    blockchain.new_block(0)

    blockchain.proof_of_work(blockchain.last_block)
    print(blockchain.hash2(blockchain.last_block))
    print(blockchain.chain)
    

