import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import chainImage from '../assets/chain.webp';

const Header = ({ navLinks, setWalletStatus }) => {
    function handleLogOut() {
        sessionStorage.removeItem('privKey');
        sessionStorage.removeItem('pubKey');
        sessionStorage.removeItem('address');
        setWalletStatus('locked');
    }

    function logOutLink(name, url) {
        return (
            <Link 
                className='ms-auto' 
                to={url} 
                style={{ textDecoration: 'none', color: 'darkgray' }}
                onClick={handleLogOut}
            >
                {name}
            </Link>
        );
    }

    return (
        <Navbar>
            <Container style={{
                backgroundColor: 'rgb(95,158,160)',
                borderRadius: '5px'
            }}>
                <Navbar.Brand href='/'>
                    <img
                        src={chainImage}
                        height='40'
                        alt='chain'
                    />
                    <span style={{ fontFamily: 'Fragment Mono' }}>
                        <b>School Chain</b>
                    </span>
                </Navbar.Brand>
                <Navbar.Collapse id='navbarSupportedContent'>
                    <Nav className='ms-auto'>
                        {navLinks !== undefined && navLinks.map((link, i) => {
                            if (link.name === 'Log Out') logOutLink(link.name, link.url);

                            return (
                                <Nav.Item key={i.toString()}>
                                    <Nav.Link href={link.url}>
                                        {link.name}
                                    </Nav.Link>
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