import { Container } from "react-bootstrap";
import Header from "../Header";

function Wallet({ navLinks }) {
    return (
        <>
            <Header navLinks={navLinks} />
            <Container className='postion-relative'>
                <h1 >Wallet page</h1>
            </Container>
        </>
    );
}

export default Wallet;