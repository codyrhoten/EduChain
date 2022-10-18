import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Header from './components/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Wallet from './components/Wallet';

function App() {
    // const [navLinks, setNavLinks] = useState([]);
    const [walletSide, setWalletSide] = useState(false);

    const navLinks = [
        { name: 'Wallet', url: '/wallet'},
        { name: 'Faucet', url: '/faucet'},
        { name: 'Miner', url: '/miner'},
    ];

    const walletLinks = [
        {name: 'Explorer', url: '/'},
        {name: 'Create', url: '/create-wallet'},
        {name: 'Open', url: '/open-wallet'},
    ];

    if (walletSide) navLinks = walletLinks;

    return (
        <div className='App'>
            <Container >
                <Header navLinks={navLinks} />
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route 
                        path='/wallet' 
                        element={<Wallet setWalletSide={setWalletSide} />}
                    />
                </Routes>
            </Container>
        </div>
    );
}

export default App;
