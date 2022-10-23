import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Wallet from './components/wallet/Wallet';

function App() {

    return (
        <div className='App'>
            <Routes>
                <Route 
                    path='/' 
                    element={<Home />} 
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
