import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from 'axios';
import Header from "../../components/Header";
import { Card, Container } from "react-bootstrap";
import SearchBar from "../../components/explorer/SearchBar";
import TxTable from "../../components/explorer/TxTable";
// dummy data
import api from '../../dummyApi';

const Address = ({ navLinks }) => {
    const { address } = useParams();
    const [addressData, setAddressData] = useState({
        balance: 0,
        txs: []
    });

    useEffect(() => {
        const _blockchain = new api();

        (async function() {
            const _addressData = await axios.get(`http://localhost:3333/address/${address}`);
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
                    <i>Balance: {addressData.balance} coins</i>
                </h4>
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