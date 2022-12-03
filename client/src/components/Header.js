import { Navbar, Nav, Container } from 'react-bootstrap';
import chainImage from '../assets/chain.webp';

const Header = ({ navLinks }) => {
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
                        <b>Axiom</b>
                    </span>
                </Navbar.Brand>
                <Navbar.Collapse id='navbarSupportedContent'>
                    <Nav className='ms-auto'>
                        {navLinks !== undefined && navLinks.map((link, i) => {
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