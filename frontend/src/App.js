import { useState, useEffect } from 'react'; 
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Wallet from './components/wallet/Wallet';
import AllBlocks from './pages/AllBlocks';
import 'bootstrap/dist/css/bootstrap.min.css';
// dummy data
import api from './dummyApi';

function App() {
    const [blocks, setBlocks] = useState([]);
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

    useEffect(() => {
        const data = api();
        setBlocks(data.blocks)
        setLatestBlx(data.latestBlx);
        setLatestTxs(data.latestTxs);
    }, []);

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
                    path='/all-blocks'
                    element={<AllBlocks 
                        navLinks={explorerLinks} 
                        blocks={blocks}
                    />}
                />
            </Routes>
        </div>
    );
}

export default App;
