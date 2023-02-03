import { useState, useContext } from "react";
import { useWallet } from '../../wallet-context';
import { Container } from "react-bootstrap";
import Header from "../../components/Header/Header";

function Balance({ navLinks, setWalletStatus, walletStatus }) {
    const { isLocked } = useWallet();
    const links = (isLocked === true) ? navLinks.locked : navLinks.unlocked;
    
    return (
        <>
            <Header navLinks={links} setWalletStatus={setWalletStatus} />
            <Container className='position-relative'>
                <h1 >Wallet Balance</h1>
            </Container>
        </>
    );
}

export default Balance;