import { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route } from 'react-router-dom';
import navLinks from './utils/navLinks';
import ExplorerHome from './pages/explorer/ExplorerHome';
import AllBlocks from './pages/explorer/AllBlocks';
import Transactions from './pages/explorer/Transactions';
import TxDetails from './pages/explorer/TxDetails';
import Address from './pages/explorer/Address';
import Block from './pages/explorer/Block';
import WalletHome from './pages/Wallet/WalletHome';
import Create from './pages/Wallet/Create';
import Open from './pages/Wallet/Open';
import Balance from './pages/Wallet/Balance';
import SendTx from './pages/Wallet/SendTx';
import Faucet from './pages/Faucet';
import Miner from './pages/Miner';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [blockchain, setBlockchain] = useState({
        blocks: [],
        latestBlx: [],
        latestTxs: []
    });

    useEffect(() => {
        (async function getAllBlocks() {
            const _blocks = await axios.get('http://localhost:5555/blocks');
            let _latestBlx = _blocks.data.reverse().slice(0, 5);
            let _latestTxs = await axios.get('http://localhost:5555/all-txs');
            _latestTxs = _latestTxs.data.slice(0, 5);

            setBlockchain({
                blocks: _blocks,
                latestBlx: _latestBlx,
                latestTxs: _latestTxs,
            });

        })();
    }, []);

    return (
        <div className='App'>
            <Routes>
                {/* <-------------Explorer-------------> */}
                <Route
                    path='/'
                    element={<ExplorerHome
                        navLinks={navLinks.explorer}
                        latestBlx={blockchain.latestBlx}
                        latestTxs={blockchain.latestTxs}
                    />}
                />
                <Route
                    path='/blocks'
                    element={<AllBlocks
                        navLinks={navLinks.explorer}
                        blocks={blockchain.blocks}
                    />}
                />
                <Route
                    path='/transactions'
                    element={<Transactions
                        navLinks={navLinks.explorer}
                    />}
                />
                <Route
                    path='/block/:blockIndex'
                    element={<Block
                        navLinks={navLinks.explorer}
                    />}
                />
                <Route
                    path='/tx/:txHash'
                    element={<TxDetails navLinks={navLinks.explorer} />}
                />
                <Route
                    path='/address/:address'
                    element={<Address navLinks={navLinks.explorer} />}
                />
                {/* <----------------Wallet----------------> */}
                <Route
                    path='/wallet/home'
                    element={<WalletHome navLinks={navLinks.wallet} />}
                />
                <Route
                    path='/wallet/create'
                    element={<Create navLinks={navLinks.wallet} />}
                />
                <Route
                    path='/wallet/open'
                    element={<Open navLinks={navLinks.wallet} />}
                />
                <Route
                    path='/wallet/balance'
                    element={<Balance navLinks={navLinks.wallet} />}
                />
                <Route
                    path='/wallet/send-tx'
                    element={<SendTx navLinks={navLinks.wallet} />}
                />
                {/* <---------------Faucet---------------> */}
                <Route
                    path='/faucet'
                    element={<Faucet navLinks={navLinks.faucet} />}
                />
                {/* <----------------Miner----------------> */}
                <Route
                    path='/miner'
                    element={<Miner navLinks={navLinks.miner} />}
                />
            </Routes>
        </div>
    );
}

export default App;
