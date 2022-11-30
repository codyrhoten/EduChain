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
// dummy data
import api from './dummyApi';

function App() {
    const [blockchain, setBlockchain] = useState({
        blocks: [],
        latestBlx: [],
        latestTxs: []
    });

    useEffect(() => {
        (async function getAllBlocks() {
            const _blockchain = new api();
            const _blocks = _blockchain.getAllBlocks().reverse();
            const blockchain = await axios.get('http://localhost:3333/blockchain');
            const _latestBlx = blockchain.data.chain/* .reverse.slice(0, 5) */;

            setBlockchain({
                blocks: _blocks,
                latestBlx: _latestBlx,
                latestTxs: _blockchain.getAllTxs().slice(0, 5),
            });
        })();

        console.log(blockchain.latestBlx);
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
