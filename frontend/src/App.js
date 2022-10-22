import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Wallet from './components/wallet/Wallet';
import { useEffect, useState } from 'react';
// dummy data
import blockchain from './blockchain.json';

function App() {
    const [blocks, setBlocks] = useState([]);
    const [txs, setTxs] = useState([]);

    useEffect(() => {
        const _blocks = blockchain.chain;
        setBlocks(_blocks);
        let _txs = [];
        _blocks.forEach(b => _txs.push(...b.txs));
        setTxs(_txs);
    }, []);

    return (
        <div className='App'>
            <Routes>
                <Route 
                    path='/' 
                    element={<Home blocks={blocks} txs={txs} />} 
                />
                <Route
                    path='/wallet'
                    element={<Wallet />}
                />
            </Routes>
        </div>
    );
}

export default App;
