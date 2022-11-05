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
    const [blockchain, setBlockchain] = useState({
        blocks: [],
        txs: [],
        latestBlx: [],
        latestTxs: []
    });

    useEffect(() => {
        setBlockchain({
            blocks: data.getBlocks(),
            txs: data.getTxs(),
            latestBlx: data.getBlocks().slice(0, 5),
            latestTxs: data.getTxs().slice(0, 5)
        })
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
                    element={<AllTxs 
                        navLinks={navLinks.explorer} 
                        txs={blockchain.txs}
                    />}
                />
                <Route
                    path='/block/:blockIndex'
                    element={<Block 
                        navLinks={navLinks.explorer}
                        blocks={blockchain.blocks}
                    />}
                />
                <Route
                    path='/tx/:txHash'
                    element={<Transaction 
                        navLinks={navLinks.explorer}
                        txs={blockchain.txs}
                    />}
                />
            </Routes>
        </div>
    );
}

export default App;
