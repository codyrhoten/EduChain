import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Wallet from './components/wallet/Wallet';
// dummy data
import blockchain from './blockchain.json';
import { useEffect, useState } from 'react';

function App() {
    const [blocks, setBlocks] = useState([]);
    const [txs, setTxs] = useState([]);

    useEffect(() => {
        // const _blocks = blockchain.chain;
        setBlocks(blockchain.chain);
        let _txs = [];
        blocks.forEach(b => _txs.push(...b.txs));
        setTxs(_txs);
    }, [blocks]);

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
