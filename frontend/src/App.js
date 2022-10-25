import { useState, useEffect } from 'react'; 
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Wallet from './components/wallet/Wallet';
// dummy data
import api from './dummyApi';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [blocks, setBlocks] = useState([]);
    const [txs, setTxs] = useState([]);

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
        setBlocks(data.latestBlx);
        setTxs(data.latestTxs);
    }, []);

    return (
        <div className='App'>
            <Routes>
                <Route 
                    path='/' 
                    element={<Home navLinks={explorerLinks} blocks={blocks} txs={txs} />} 
                />
                <Route
                    path='/wallet'
                    element={<Wallet navLinks={walletLinks} />}
                />
            </Routes>
        </div>
    );
}

export default App;
