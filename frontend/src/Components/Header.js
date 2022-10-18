import { Navbar, Nav, Container } from 'react-bootstrap';
import mapImage from '../assets/scroll-with-map.png';

const Header = ({ navLinks }) => {
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