import { WalletProvider } from './wallet-context';
import { Routes, Route } from 'react-router-dom';
import navLinks from './utils/navLinks';
import ExplorerHome from './pages/explorer/ExplorerHome';
import AllBlocks from './pages/explorer/AllBlocks';
import Transactions from './pages/explorer/Transactions';
import TxDetails from './pages/explorer/TxDetails';
import Address from './pages/explorer/Address';
import Block from './pages/explorer/Block';
import WalletHome from './pages/Wallet/WalletHome';
import Open from './pages/Wallet/Open';
import Balance from './pages/Wallet/Balance';
import SendTx from './pages/Wallet/SendTx';
import Faucet from './pages/Faucet';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <div className='App'>
            <WalletProvider>
                <Routes>
                    {/* <-----------------Explorer-----------------> */}
                    <Route
                        path='/'
                        element={<ExplorerHome navLinks={navLinks.explorer} />}
                    />
                    <Route
                        path='/blocks'
                        element={<AllBlocks navLinks={navLinks.explorer} />}
                    />
                    <Route
                        path='/transactions'
                        element={<Transactions navLinks={navLinks.explorer} />}
                    />
                    <Route
                        path='/block/:blockIndex'
                        element={<Block navLinks={navLinks.explorer} />}
                    />
                    <Route
                        path='/tx/:txHash'
                        element={<TxDetails navLinks={navLinks.explorer} />}
                    />
                    <Route
                        path='/address/:address'
                        element={<Address navLinks={navLinks.explorer} />}
                    />
                    {/* <--------------------Wallet--------------------> */}
                    <Route
                        path='/wallet/home'
                        element={<WalletHome navLinks={navLinks.wallet} />}
                    />
                    <Route
                        path='/wallet/open'
                        element={<Open navLinks={navLinks.wallet} />}
                    />
                    <Route
                        path='/wallet/balance'
                        element={<Balance navLinks={navLinks.wallet} />}
                    />
                    <Route
                        path='/wallet/send-tx'
                        element={<SendTx navLinks={navLinks.wallet} />}
                    />
                    {/* <-------------------Faucet-------------------> */}
                    <Route
                        path='/faucet'
                        element={<Faucet navLinks={navLinks.faucet} />}
                    />
                </Routes>
            </WalletProvider>
        </div>
    );
}

export default App;
