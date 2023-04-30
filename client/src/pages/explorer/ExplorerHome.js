import Header from "../../components/Header/Header";
import { Container, Row } from "react-bootstrap";
import LatestBlocks from "../../components/explorer/LatestBlocks";
import LatestTxs from "../../components/explorer/LatestTxs";

function ExplorerHome({ latestBlx, latestTxs }) {
    return (
        <>
            <Header />
            <Container style={{ marginTop: "7rem" }}>
                <h4 className="text-center my-5"><i>EduChain PoW Testnet Explorer</i></h4>
                <Container className="position-relative">
                    <Row>
                        <LatestBlocks latestBlx={latestBlx} />
                        <LatestTxs latestTxs={latestTxs} />
                    </Row>
                </Container>
            </Container>
        </>
    );
}

export default ExplorerHome;
