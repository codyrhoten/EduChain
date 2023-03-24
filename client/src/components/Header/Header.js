import { useWallet } from '../../wallet-context';
import { Navbar, Nav, Container, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import chainImage from '../../assets/chain.webp';
import styles from './Header.module.css';

const Header = ({ navLinks }) => {
    const { isLocked, changeWalletState } = useWallet();

    function closeWallet() {
        sessionStorage.removeItem('privKey');
        sessionStorage.removeItem('pubKey');
        sessionStorage.removeItem('address');
        changeWalletState(true);
        window.location.replace('http://localhost:9999/wallet/home');
    }

    function closeWalletButton(name) {
        return (
            <button
                key='4'
                className='mx-2 rounded border border-1 border-dark px-2'
                style={{
                    textDecoration: 'none',
                    color: 'black',
                    backgroundColor: 'rgb(255, 223, 0)',
                }}
                onClick={closeWallet}
            >
                {name}
            </button>
        );
    }

    return (
        <Navbar>
            <Container style={{
                backgroundColor: 'rgb(95,158,160)',
                borderRadius: '5px'
            }}>
                <Navbar.Brand as={Link} to='/' style={{ fontFamily: 'Fragment Mono' }}>
                    <div>
                        <img src={chainImage} height='40' alt='chain' />
                        <span><b>EduChain</b></span>
                    </div>
                </Navbar.Brand>
                <Navbar.Collapse id='navbarSupportedContent'>
                    <Nav className='ms-auto'>
                        {navLinks !== undefined && navLinks.map((link, i) => {
                            if (link.name === 'Close Wallet') {
                                return closeWalletButton(link.name);
                            }

                            return (
                                <Nav.Item key={i.toString()}>
                                    <Link to={link.url} className={styles._link}>
                                        {link.name}
                                    </Link>
                                </Nav.Item>
                            );
                        })}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
};

export default Header;