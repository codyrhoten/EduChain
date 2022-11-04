import { useState, useEffect } from 'react'; 
import { Routes, Route } from 'react-router-dom';
import navLinks from './utils/navLinks';
import Home from './pages/explorer/Home';
import Wallet from './pages/Wallet';
import Faucet from './pages/Faucet';
import Miner from './pages/Miner';
import AllBlocks from './pages/explorer/AllBlocks';
import AllTxs from './pages/explorer/AllTxs';
import Block from './pages/explorer/Block';
import Transaction from './pages/explorer/Transaction';
import 'bootstrap/dist/css/bootstrap.min.css';
// dummy data
import api from './dummyApi';

function App() {
    const data = new api();
    const [blocks, setBlocks] = useState([]);
    const [txs, setTxs] = useState([]);
    const [latestBlx, setLatestBlx] = useState([]);
    const [latestTxs, setLatestTxs] = useState([]);

    useEffect(() => {
        setBlocks(data.getBlocks().reverse());
        setTxs(data.getTxs());
        setLatestBlx(blocks.slice(0, 5));
        setLatestTxs(txs.slice(0, 5));
    }, []);

    console.log(blocks)
    console.log(latestBlx)

    return (
        <div className='App'>
            <Routes>
                <Route 
                    path='/' 
                    element={<Home 
                        navLinks={navLinks.explorer}
                        latestBlx={latestBlx} 
                        latestTxs={latestTxs} 
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
                        blocks={blocks}
                    />}
                />
                <Route
                    path='/transactions'
                    element={<AllTxs 
                        navLinks={navLinks.explorer} 
                        txs={txs}
                    />}
                />
                <Route
                    path='/block/:blockIndex'
                    element={<Block 
                        navLinks={navLinks.explorer}
                        blocks={blocks}
                    />}
                />
                <Route
                    path='/tx/:txHash'
                    element={<Transaction 
                        navLinks={navLinks.explorer}
                        txs={txs}
                    />}
                />
            </Routes>
        </div>
    );
}

export default App;
