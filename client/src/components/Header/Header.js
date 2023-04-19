import { useWallet } from "../../wallet-context";
import { Navbar, Nav, Container, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import chainImage from "../../assets/chain.webp";
import styles from "./Header.module.css";

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
        backgroundColor: "rgb(95,158,160)",
      }}
    >
      <Navbar.Brand as={Link} to="/" style={{ fontFamily: "Fragment Mono" }}>
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
      <Nav>
        <Nav.Item>
          <Link to="/" className={styles._link}>
            Explorer
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link to="/faucet" className={styles._link}>
            Faucet
          </Link>
        </Nav.Item>
        <Nav.Item>
          <div className='dropdown dropdown-toggle'>
            <p className={styles._link} data-bs-toggle="dropdown" aria-expanded="false">Wallet</p>
            <ul className='dropdown-menu'>
              <li><Link to='/wallet/home' className={styles._link}>Create</Link></li>
              <li><Link to='/wallet/open' className={styles._link}>Open</Link></li>
            </ul>
          </div>
        </Nav.Item>
      </Nav>
    </Navbar>
  );
};

export default Header;
