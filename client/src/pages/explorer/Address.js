import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from 'axios';
import Header from "../../components/Header/Header";
import { Card, Container } from "react-bootstrap";
import TxTable from "../../components/explorer/TxTable";

const Address = ({ navLinks }) => {
    const { address } = useParams();
    const [addressData, setAddressData] =
        useState({ balance: 0, txs: [] });

    useEffect(() => {
        (async function () {
            const _addressData = await axios.get(`http://localhost:5555/address-data/${address}`);
            setAddressData({
                balance: _addressData.data.balance,
                txs: _addressData.data.txs.reverse()
            });
        })();
    }, [address]);

    return (
        <>
            <Header navLinks={navLinks} />
            <Container style={{ marginTop: "7rem" }}>
            <h4 className='text-center my-4'><i>EduChain PoW Testnet Explorer</i></h4>
                <h4 align='center'>
                    Address: {address}<br />
                </h4>
                <p align='center'>
                    <i>Confirmed Balance: {Number(addressData.balance.confirmed) / 1000000} EDU</i>
                </p>
                {addressData.txs.length > 0 ?
                    <TxTable txs={addressData.txs} /> :
                    <Card align='center' className='p-5'><b>
                        There are no matching addresses
                    </b></Card>}
            </Container>
        </>
    );
};

export default Address;