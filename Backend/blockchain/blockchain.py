import hashlib
import json
from flask import Flask, jsonify, request
from sqlite3 import TimestampFromTicks
from time import time


class Blockchain(object):
    def __init__(self):
        self.chain = []  # stores the blockchain
        self.pending_transactions = []  # stores list of transactions waiting to be mined
        # Create the Genesis block
        self.genesis_block()
        
        
    def __repr__(self):
        return (f'Blockchain: {self.chain}')
        
        
    def genesis_block(self):
        timestamp = time()
        #current_hash = self.hash2(timestamp, 1, [])

        block = {
            'index'         : 1,
            'timestamp'     : timestamp,
            'transactions'  : [],
            'nonce'         : 0,
            'previous_hash' : '0000',
            'myhash'        : "genesis_hash"
        }
        self.chain.append(block)

 
    def new_transaction(self, sender, recipient, amount):
        """
        Creates a new transaction in the pending list to go into the next mined block
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
    
 
    def new_block(self, nonce = 0, previous_hash = None):
        """
        # Create a new Block and adds it to the chain
        :param proof: <int> The proof given by the Proof of Work Alogrithm
        :param previous_hash: (Optional) <str> Hash of the previous block
        :return: <dict> New Block
        """
        timestamp = time()
        prev_hash = self.chain[-1]["myhash"]

        hash_block = {
            'timestamp'     : timestamp,
            'transactions'  : self.pending_transactions,
            'nonce'         : 0,
            'previous_hash' : prev_hash
        }
        myhash = self.hash(hash_block)
        #while hex_to_binary(myhash)[0:4] != '0000':
        while myhash[0:4] != '0000':
            hash_block["nonce"] +=1
            myhash = self.hash(hash_block)
        print(f'hash_block hash: {myhash}')
        block = {
            'index'         : len(self.chain) + 1,
            'timestamp'     : timestamp,
            'transactions'  : self.pending_transactions,
            'nonce'         : hash_block["nonce"],
            'previous_hash' : prev_hash,
            'myhash'        : myhash
        }
        # Reset the current list of transactions
        self.pending_transactions = []
        #self.chain.append(Blockchain.proof_of_work(block))
        self.chain.append(block)
        return block

    
    def to_json(self):
        #Serialize the blockchain into a list of blocks
        return self.chain
    
    
    @staticmethod
    def stringify(data):
        return json.dumps(data)
    
      
    @staticmethod
    def hash(block): 
        # Hashes a block
        # We must make sure that the Dictionary is ordered, or we will have inconsistent hashes
        block_string = json.dumps(block, sort_keys = True).encode()
        return hashlib.sha256(block_string).hexdigest()

    
    @staticmethod
    def proof_of_work(block):
        """
        Proof-of-Work algorithm:
        Iterate the "proof" field (nonce) until the conditions are satisfied (e.g. 4 leading zeroes on the hash)
        :param block: <dict>
        """
        # all lines with nonce are new
        nonce = 0
        while not Blockchain.valid_proof(block):
            #nonce += 1
            block["nonce"] += 1
            #block["proof"] = nonce
        print(f'nonce: {nonce}')
        
        return block


    @staticmethod
    def valid_proof(block):
        """
        The Proof-of-Work conditions
        Check if the hash of the block starts with 4 zeroes
        higher difficulty == more zeroes, lower difficulty == fewer zeroes
        :param block: <dict>
        """
        return Blockchain.hash(block)[:4] == "0000"

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
    blockchain.new_block(0)
    blockchain.new_transaction("Jean", "Cody", 199)
    blockchain.new_block(0)

    blockchain.proof_of_work(blockchain.last_block)
    print(blockchain.hash(blockchain.last_block))
    print(blockchain.chain)
    

