import Container from 'react-bootstrap/Container';
import Header from './components/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Wallet from './components/Wallet';

function App() {
    return (
        <div className='App'>
            <Container >
                <Header />
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/wallet' element={<Wallet />} />
                </Routes>
            </Container>
        </div>
    );
}

export default App;
