import { useState } from "react";
import { Container } from "react-bootstrap";
import Header from "../../components/Header";

function Create({ navLinks }) {
    const [wallet, setWallet] = useState('locked');

    const links = (wallet === 'locked') ? navLinks.locked : navLinks.unlocked;
    
    return (
        <>
            <Header navLinks={links} />
            <Container className='position-relative'>
                <h1 >Create Wallet</h1>
            </Container>
        </>
    );
}

export default Create;