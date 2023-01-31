import { useState } from "react";
import { Container } from "react-bootstrap";
import Header from "../../components/Header";

function WalletHome({ navLinks }) {
    const [wallet, setWallet] = useState('locked');

    const links = (wallet === 'locked') ? navLinks.locked : navLinks.unlocked;
    
    return (
        <>
            <Header navLinks={links} />
            <Container className='position-relative'>
                <h1 >Wallet Home</h1>
            </Container>
        </>
    );
}

export default WalletHome;