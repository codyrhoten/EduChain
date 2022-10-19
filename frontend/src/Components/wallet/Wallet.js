import { Container } from "react-bootstrap";
import Header from "../Header";

function Wallet() {
    const walletLinks = [
        { name: 'Explorer', url: '/' },
        { name: 'Create', url: '/create-wallet' },
        { name: 'Open', url: '/open-wallet' },
    ];

    return (
        <>
            <Header navLinks={walletLinks} />
            <Container className='postion-relative'>
                <h1 >Wallet page</h1>
            </Container>
        </>
    );
}

export default Wallet;