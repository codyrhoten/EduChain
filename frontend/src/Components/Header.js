import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import mapImage from '../assets/scroll-with-map.png';

const Header = () => {
    const navLinks = [
        { name: 'My Wallet', url: '/wallet' },
        { name: 'link2', url: '/link2' },
        { name: 'link3', url: '/link3' },
    ];

    return (
        <Navbar>
            <Container style={{ backgroundColor: 'rgb(95,158,160)' }}>
                <Navbar.Brand href='/'>
                    <img
                        src={mapImage}
                        height='36'
                        alt='map scroll unfurled'
                    />
                    <span>name of chain here</span>
                </Navbar.Brand>
                <Navbar.Collapse id='navbarSupportedContent'>
                    <Nav className='ms-auto'>
                        {navLinks.map((link, i) => {
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