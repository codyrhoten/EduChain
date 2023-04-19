import Header from "../../components/Header/Header";
import { Container, Row } from "react-bootstrap";
import LatestBlocks from "../../components/explorer/LatestBlocks";
import LatestTxs from "../../components/explorer/LatestTxs";

function ExplorerHome({ latestBlx, latestTxs, navLinks }) {
  return (
    <>
      <Header navLinks={navLinks} />
      <Container style={{ marginTop: "150px" }}>
        <h4 className="text-center my-4">
          <i>EduChain PoW Testnet Explorer</i>
        </h4>
        <Container className="postion-relative">
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
