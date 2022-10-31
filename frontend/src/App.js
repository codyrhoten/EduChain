import { useState, useEffect } from 'react'; 
import { Routes, Route } from 'react-router-dom';
import Home from './pages/explorer/Home';
import Wallet from './pages/Wallet';
import Faucet from './pages/Faucet';
import Miner from './pages/Miner';
import AllBlocks from './pages/explorer/AllBlocks';
import AllTxs from './pages/explorer/AllTxs';
import Block from './pages/explorer/Block';
import 'bootstrap/dist/css/bootstrap.min.css';
// dummy data
import api from './dummyApi';

function App() {
    const [blocks, setBlocks] = useState([]);
    const [txs, setTxs] = useState([]);
    const [latestBlx, setLatestBlx] = useState([]);
    const [latestTxs, setLatestTxs] = useState([]);

    const explorerLinks = [
        { name: 'Wallet', url: '/wallet' },
        { name: 'Faucet', url: '/faucet' },
        { name: 'Miner', url: '/miner' },
    ];

    const walletLinks = [
        { name: 'Explorer', url: '/' },
        { name: 'Create', url: '/create-wallet' },
        { name: 'Open', url: '/open-wallet' },
    ];

    const faucetLinks = [
        { name: 'Explorer', url: '/'},
        { name: 'Wallet', url: '/wallet'},
        { name: 'Miner', url: '/miner'},
    ]

    const minerLinks = [
        { name: 'Explorer', url: '/'},
        { name: 'Wallet', url: '/wallet'},
        { name: 'Faucet', url: '/faucet'},
    ];

    useEffect(() => {
        const data = api();
        setBlocks(data.blocks);
        setTxs(data.txs);
        setLatestBlx(data.latestBlx);
        setLatestTxs(data.latestTxs);
    }, []);

    console.log(blocks)

    return (
        <div className='App'>
            <Routes>
                <Route 
                    path='/' 
                    element={<Home 
                        navLinks={explorerLinks} 
                        latestBlx={latestBlx} 
                        latestTxs={latestTxs} 
                    />} 
                />
                <Route
                    path='/wallet'
                    element={<Wallet navLinks={walletLinks} />}
                />
                <Route
                    path='/faucet'
                    element={<Faucet navLinks={faucetLinks} />}
                />
                <Route
                    path='/miner'
                    element={<Miner navLinks={minerLinks} />}
                />
                <Route
                    path='/blocks'
                    element={<AllBlocks 
                        navLinks={explorerLinks} 
                        blocks={blocks}
                    />}
                />
                <Route
                    path='/transactions'
                    element={<AllTxs 
                        navLinks={explorerLinks} 
                        txs={txs}
                    />}
                />
                <Route
                    path='/block/:blockIndex'
                    element={<Block 
                        navLinks={explorerLinks}
                        blocks={blocks}
                    />}
                />
            </Routes>
        </div>
    );
}

export default App;
