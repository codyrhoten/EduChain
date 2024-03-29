import { useWallet } from "../../wallet-context";
import { config } from '../../environments';
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
// import chainImage from "../../assets/chain.webp";
import styles from "./Header.module.css";

const Header = () => {
    const siteUrl = config.frontEndUrl;
    const { isLocked, changeWalletState } = useWallet();

    function closeWallet() {
        sessionStorage.removeItem("privKey");
        sessionStorage.removeItem("pubKey");
        sessionStorage.removeItem("address");
        changeWalletState(true);
        window.location.replace(`${siteUrl}/wallet/home`);
    }

    return (
        <Navbar
            fixed="top"
            style={{
                backgroundColor: "rgb(95,158,160)",
                borderBottom: "0.1rem solid black"
            }}
        >
            <Navbar.Text
                as={Link}
                to="/"
                className={styles._brand}
            >
                {/* <img src={chainImage} height="40" alt="three yellow chain links" /> */}
                EduChain
            </Navbar.Text>
            <Navbar.Collapse id="navbarSupportedContent">
                <Nav className='ms-auto me-5'>
                    <Nav.Item className="mx-1">
                        <Link to="/" className={styles._link}>
                            Explorer
                        </Link>
                    </Nav.Item>
                    <NavDropdown className='mx-4' title="Wallet" id={styles.dropdowntitle}>
                        {isLocked ? (
                            <>
                                <NavDropdown.Item
                                    as={Link}
                                    to='/wallet/home'
                                    className={styles._dropdownitem}
                                >
                                    Create
                                </NavDropdown.Item>
                                <NavDropdown.Item
                                    as={Link}
                                    to='/wallet/open'
                                    className={styles._dropdownitem}
                                >
                                    Open
                                </NavDropdown.Item>
                            </>
                        ) : (
                            <>
                                <NavDropdown.Item
                                    as={Link}
                                    to='/wallet/balance'
                                    className={styles._dropdownitem}
                                >
                                    Balance
                                </NavDropdown.Item>
                                <NavDropdown.Item
                                    as={Link}
                                    to='/wallet/send-tx'
                                    className={styles._dropdownitem}
                                >
                                    Send
                                </NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item
                                    onClick={closeWallet}
                                    className={styles._dropdownitem}
                                >
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
