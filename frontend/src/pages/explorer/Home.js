import Header from '../../components/Header';
import { Container, Row } from 'react-bootstrap';
import SearchBar from "../../components/explorer/SearchBar";
import LatestBlocks from '../../components/explorer/LatestBlocks';
import LatestTxs from '../../components/explorer/LatestTxs';
import { useEffect, useState } from 'react';


function Home({ latestBlx, latestTxs, navLinks }) {
    console.log(latestBlx)

    return (
        <>
            <Header navLinks={navLinks} />
            <Container className='postion-relative'>
                <SearchBar />
                <Row>
                    <LatestBlocks latestBlx={latestBlx} />
                    <LatestTxs latestTxs={latestTxs} />
                </Row>
            </Container>
        </>
    );
}

export default Home;