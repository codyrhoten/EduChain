const crypto = require("crypto");
const SHA256 = (message) =>
  crypto.createHash("sha256").update(message).digest("hex");

class Block {
  timeStamp = "";
  data = [];
  constructor(timeStamp, data) {
    this.timeStamp = timeStamp;
    this.data = data;
    this.hash = this.getHash();
    this.prevHash = "";
  }

  getHash() {
    return SHA256(JSON.stringify(this.data) + this.timeStamp + this.prevHash);
  }
}

class Blockchain {
  constructor() {
    this.chain = [new Block(Date.now().toString())];
  }

  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(block) {
    block.prevHash = this.getLastBlock().hash;
    block.hash = block.getHash();

    this.chain.push(block);
  }

  isValid(blockchain = this) {
    for (let i = 1; i < blockchain.chain.length; i++) {
      const currentBlock = blockchain.chain[i];
      const prevBlock = blockchain.chain[i - 1];

      if (
        currentBlock.hash !== currentBlock.getHash() ||
        currentBlock.prevHash !== prevBlock.hash
      ) {
        return false;
      }
    }
    return true;
  }
}

const Chain = new Blockchain();
Chain.addBlock(new Block(Date.now().toString(), ["Hello", "World2"]));
console.log(Chain.chain);
console.log(Chain.isValid());
