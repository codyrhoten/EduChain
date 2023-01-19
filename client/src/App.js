import { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route } from 'react-router-dom';
import navLinks from './utils/navLinks';
import Home from './pages/explorer/Home';
import Wallet from './pages/Wallet';
import Faucet from './pages/Faucet';
import Miner from './pages/Miner';
import AllBlocks from './pages/explorer/AllBlocks';
import Transactions from './pages/explorer/Transactions';
import Block from './pages/explorer/Block';
import TxDetails from './pages/explorer/TxDetails';
import Address from './pages/explorer/Address';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [blockchain, setBlockchain] = useState({
        blocks: [],
        latestBlx: [],
        latestTxs: []
    });

    useEffect(() => {
        (async function getAllBlocks() {
            const blockchain = await axios.get('http://localhost:5555/blockchain');
            let _latestBlx = blockchain.data.chain;
            _latestBlx = _latestBlx.reverse().slice(0, 5);
            let _latestTxs = await axios.get('http://localhost:5555/allTxs');
            _latestTxs = _latestTxs.data.slice(0, 5);

            setBlockchain({
                blocks: blockchain.chain,
                latestBlx: _latestBlx,
                latestTxs: _latestTxs,
            });
        })();
    }, []);

    return (
        <div className='App'>
            <Routes>
                <Route
                    path='/'
                    element={<Home
                        navLinks={navLinks.explorer}
                        latestBlx={blockchain.latestBlx}
                        latestTxs={blockchain.latestTxs}
                    />}
                />
                <Route
                    path='/wallet'
                    element={<Wallet navLinks={navLinks.wallet} />}
                />
                <Route
                    path='/faucet'
                    element={<Faucet navLinks={navLinks.faucet} />}
                />
                <Route
                    path='/miner'
                    element={<Miner navLinks={navLinks.miner} />}
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
            </Routes>
        </div>
    );
}

export default App;
