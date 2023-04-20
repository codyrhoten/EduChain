import { useWallet } from "../../wallet-context";
import { Navbar, Nav, Dropdown, Col } from "react-bootstrap";
import { Link, useSearchParams } from "react-router-dom";
import chainImage from "../../assets/chain.webp";
import styles from "./Header.module.css";
import { Children, forwardRef, useState } from "react";

const Header = ({ navLinks }) => {
    const { isLocked, changeWalletState } = useWallet();

    function closeWallet() {
        sessionStorage.removeItem("privKey");
        sessionStorage.removeItem("pubKey");
        sessionStorage.removeItem("address");
        changeWalletState(true);
        window.location.replace("http://localhost:9999/wallet/home");
    }

    function closeWalletButton(name) {
        return (
            <button
                key="4"
                className="mx-2 rounded border border-1 border-dark px-2"
                style={{
                    textDecoration: "none",
                    color: "black",
                    backgroundColor: "rgb(255, 223, 0)",
                }}
                onClick={closeWallet}
            >
                {name}
            </button>
        );
    }

    return (
        <Navbar
            fixed="top"
            style={{
                backgroundColor: "rgb(95,158,160)"
            }}
        >
            <Navbar.Brand as={Link} to="/" style={{ fontFamily: "Fragment Mono", marginLeft: '1.25rem' }}>
                <div>
                    <img src={chainImage} height="40" alt="chain" />
                    <span>
                        <b>EduChain</b>
                    </span>
                </div>
            </Navbar.Brand>
            {/* <Navbar.Collapse id="navbarSupportedContent">
        <Nav className="ms-auto">
          {navLinks !== undefined &&
            navLinks.map((link, i) => {
              if (link.name === "Close Wallet") {
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
       </Navbar.Collapse> */}
            <Navbar.Collapse id="navbarSupportedContent">
                <Nav className='ms-auto me-5'>
                    <Nav.Item className="mx-1">
                        <Link to="/" className={styles._link}>
                            Explorer
                        </Link>
                    </Nav.Item>
                    <Nav.Item className="mx-1">
                        <Link to="/faucet" className={styles._link}>
                            Faucet
                        </Link>
                    </Nav.Item>
                    <Dropdown className="mx-1">
                        <Dropdown.Toggle className={styles._link}>
                            Wallet
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item>
                                <Link to='/wallet/home' className={styles._dropdownitem}>
                                    Create
                                </Link>
                            </Dropdown.Item>
                            <Dropdown.Item>
                                <Link to='/wallet/open' className={styles._dropdownitem}>
                                    Open
                                </Link>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Header;
