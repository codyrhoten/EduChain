import { useWallet } from "../../wallet-context";
import { Navbar, Nav, NavDropdown, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import chainImage from "../../assets/chain.webp";
import styles from "./Header.module.css";

const Header = () => {
    const { isLocked, changeWalletState } = useWallet();

    function closeWallet() {
        sessionStorage.removeItem("privKey");
        sessionStorage.removeItem("pubKey");
        sessionStorage.removeItem("address");
        changeWalletState(true);
        window.location.replace("https://educhain.codyrhoten.com/wallet/home");
    }

    return (
        <Navbar
            fixed="top"
            style={{
                backgroundColor: "rgb(95,158,160)",
                borderBottom: "0.1rem solid black"
            }}
        >
            <Navbar.Brand 
                as={Link} 
                to="/" 
                style={{ fontFamily: "Fragment Mono", marginLeft: '1.25rem' }}
            >
                <img src={chainImage} height="40" alt="chain" />
                <span>
                    <b>EduChain</b>
                </span>
            </Navbar.Brand>
            <Navbar.Collapse id="navbarSupportedContent">
                <Nav className='ms-auto me-5'>
                    <Nav.Item className="mx-1">
                        <Link to="/" className={styles._link}>
                            Explorer
                        </Link>
                    </Nav.Item>
                    <NavDropdown className={`mx-1`} title="Wallet" id={styles.dropdowntitle}>
                        {isLocked ? (
                            <>
                                <NavDropdown.Item>
                                    <Link to='/wallet/home' className={styles._dropdownitem}>
                                        Create
                                    </Link>
                                </NavDropdown.Item>
                                <NavDropdown.Item>
                                    <Link to='/wallet/open' className={styles._dropdownitem}>
                                        Open
                                    </Link>
                                </NavDropdown.Item>
                            </>
                        ) : (
                            <>
                                <NavDropdown.Item>
                                    <Link to='/wallet/balance' className={styles._dropdownitem}>
                                        Balance
                                    </Link>
                                </NavDropdown.Item>
                                <NavDropdown.Item>
                                    <Link to='/wallet/send-tx' className={styles._dropdownitem}>
                                        Send
                                    </Link>
                                </NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={closeWallet}>
                                    Close Wallet
                                </NavDropdown.Item>
                            </>
                        )}
                    </NavDropdown>
                    <Nav.Item className="mx-1">
                        <Link to="/faucet" className={styles._link}>
                            Faucet
                        </Link>
                    </Nav.Item>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Header;
