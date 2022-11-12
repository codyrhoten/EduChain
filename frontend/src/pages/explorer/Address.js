import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import { Container } from "react-bootstrap";
import SearchBar from "../../components/explorer/SearchBar";
import TxTable from "../../components/explorer/TxTable";
// dummy data
import api from '../../dummyApi';

const Address = ({ navLinks }) => {
    const { address } = useParams();
    const [addressData, setAddressData] = useState({});

    useEffect(() => {
        const blockchain = new api();
        setAddressData(blockchain.getAddressHist(address));
    }, [address]);

    return (
        <>
            <Header navLinks={navLinks} />
            <Container>
                <SearchBar />
                <h4 align='center'>
                    Address: {address}<br />
                    <i>Balance: {addressData.balance} coins</i>
                </h4>
                {
                    addressData !== undefined &&
                        Object.keys(addressData).length > 0 ?
                        <TxTable txs={addressData.txs} /> :
                        <p align='center'><b>
                            There are no matching entries
                        </b></p>
                }
            </Container>
        </>
    );
};

export default Address;