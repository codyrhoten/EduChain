from time import time


class Blockchain(object):
    def __init__(self):
        self.chain = []
        self.pending_transactions = []
        # Create the Genesis block
        #self.new_block(previous_hash = '1', proof = 100)

        
        
    def new_block(self):
        
        # Create a new Block and adds it to the chain
        
        pass
    
    def new_transaction(self):
        pass

    @staticmethod
    def hash(block):
        pass
    
    @property
    def last_block(self):
        pass
    
if __name__=="__main__":
    blockchain = Blockchain()      
    print(blockchain.chain)
