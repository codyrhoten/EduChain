import { Container } from "react-bootstrap";
import Header from "../components/Header";

function Miner({ navLinks }) {
    return (
        <>
            <Header navLinks={navLinks} />
            <Container className='postion-relative'>
                <h1 >Miner page</h1>
            </Container>
        </>
    );
}

export default Miner;