import { WalletProvider } from './wallet-context';
import { Routes, Route } from 'react-router-dom';
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
                        element={<ExplorerHome/>}
                    />
                    <Route
                        path='/blocks'
                        element={<AllBlocks/>}
                    />
                    <Route
                        path='/transactions'
                        element={<Transactions/>}
                    />
                    <Route
                        path='/block/:blockIndex'
                        element={<Block/>}
                    />
                    <Route
                        path='/tx/:txHash'
                        element={<TxDetails/>}
                    />
                    <Route
                        path='/address/:address'
                        element={<Address/>}
                    />
                    {/* <--------------------Wallet--------------------> */}
                    <Route
                        path='/wallet/home'
                        element={<WalletHome/>}
                    />
                    <Route
                        path='/wallet/open'
                        element={<Open/>}
                    />
                    <Route
                        path='/wallet/balance'
                        element={<Balance/>}
                    />
                    <Route
                        path='/wallet/send-tx'
                        element={<SendTx/>}
                    />
                    {/* <-------------------Faucet-------------------> */}
                    <Route
                        path='/faucet'
                        element={<Faucet/>}
                    />
                </Routes>
            </WalletProvider>
        </div>
    );
}

export default App;
