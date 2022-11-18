import { Transaction, Block } from "./blockchain";

const faucetPrivKey = 
    'c384ad080bcffb8bc4372b285835404b14d5d941723e8ad8a7e88d21410a3b19';
const faucetPubKey = 
    '03e9877575cd2ebf8240dbe0b4b0cda9a1cf86dd1201cb2966e2c32c3d15b3af98';

const genesisTx = new Transaction(
    '000000000000000000000000000000000000000000000000000000000000000000',
    faucetPubKey,
    100000,
    0
);

const genesisBlock = new Block(
    
)