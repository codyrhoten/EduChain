import { Container } from "react-bootstrap";
import Header from "../components/Header";

function Faucet({ navLinks }) {
    return (
        <>
            <Header navLinks={navLinks} />
            <Container className='postion-relative'>
                <h1 >Faucet page</h1>
            </Container>
        </>
    );
}

export default Faucet;