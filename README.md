# School Chain

<p align="center">
  <img  src="public/home-pg.png" alt="home page" />
</p>

## About

Explore a blockchain and interact with it using a wallet and faucet. Send transactions and mine them in blocks.

## Installation

```sh
npm install

// in one terminal, run:
npm run dev

// in another terminal, run:
npm start
```

### Built With

- [JavaScript](https://www.javascript.com/)
- [Bootstrap](https://getbootstrap.com/)
- [React Bootstrap](https://react-bootstrap.github.io/)
- [Express](https://www.npmjs.com/package/express)

### Important Dependancies

- [Concurrently](https://www.npmjs.com/package/concurrently)
- [Crypto-js](https://www.npmjs.com/package/crypto-js)
- [Elliptic](https://www.npmjs.com/package/elliptic?activeTab=readme)

## Features

### Wallet

<p align="center">
  <img  src="public/wallet-home-pg.png" alt="wallet home page" />
</p>

- Wallet key and address derivation
- Wallet transaction sign and send
- Check balances
- Use a private key to restore a wallet

### Faucet

<p align="center">
  <img  src="public/faucet-pg.png" alt="faucet page" />
</p>

- The total balnce of the faucet is displayed at all times
- Request School Coins (SCH)

### Block Explorer

<p align="center">
  <img  src="public/address-pg.png" alt="address page" />
</p>

<p align="center">
  <img  src="public/transaction-details-pg.png" alt="transaction details page" />
</p>

- Home page has lastest blocks & transactions.
- Displays block and transaction information.
- Displays transaction history of addresses.
- Search bar for quick access to information

### Nodes

- REST API
- Validates transactions and blocks
- Synchronizes mutliple nodes and their chains
- Mining jobs

## Miner

- Auotomatically mines when there are pending transactions

## Created by

- [Cody Rhoten | LinkedIn](https://www.linkedin.com/in/codyrhoten/)