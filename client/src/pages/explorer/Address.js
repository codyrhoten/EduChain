import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from 'axios';
import Header from "../../components/Header/Header";
import { Card, Container } from "react-bootstrap";
import SearchBar from "../../components/explorer/SearchBar";
import TxTable from "../../components/explorer/TxTable";

const Address = ({ navLinks }) => {
    const { address } = useParams();
    const [addressData, setAddressData] =
        useState({ balance: 0, txs: [] });

    useEffect(() => {
        (async function () {
            const _addressData = await axios.get(`http://localhost:5555/address/${address}`);
            setAddressData({
                balance: _addressData.data.balance,
                txs: _addressData.data.txs.reverse()
            });
        })();
    }, [address]);

    return (
        <>
            <Header navLinks={navLinks} />
            <Container>
                <SearchBar />
                <h4 align='center'>
                    Address: {address}<br />
                    <i>Confirmed Balance: {addressData.balance.confirmed} SCH</i>
                </h4>
                <p align='center'>Safe Balance: {addressData.balance.safe}</p>
                <p align='center'><i>Pending Balance: {addressData.balance.pending}</i></p>
                {addressData.txs.length > 0 ?
                    <TxTable txs={addressData.txs} /> :
                    <Card align='center' className='p-5'><b>
                        There are no matching entries
                    </b></Card>}
            </Container>
        </>
    );
};

export default Address;