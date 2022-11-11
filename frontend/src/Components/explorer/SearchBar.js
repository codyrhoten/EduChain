import explorer from '../../utils/explorer';
import { useState } from 'react';
import { Container, Form, InputGroup } from 'react-bootstrap';
import searchImage from '../../assets/search.png';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');

    const query = () => {
        const result = explorer(search);
        if (result) {
            // append result to appropriate route
            navigate(result);
            setSearch('');
        } else {
            /* front-end error handler here */
            setSearch('');
        }
    };

    return (
        <Container>
            <Form.Label htmlFor='destination'>
                <i>Axiom PoW Testnet Explorer</i>
            </Form.Label>
            <InputGroup className='mb-3' /* style={{ height: "25px" }} */>
                <Form.Control
                    aria-label='Large'
                    onChange={e => {
                        setSearch(e.target.value);
                    }}
                    value={search}
                    style={{
                        borderTopLeftRadius: '10px',
                        borderBottomLeftRadius: '10px',
                        fontFamily: 'Fragment Mono'
                    }}
                    id='destination'
                    placeholder='Search by address / block index / txn hash'
                />
                <InputGroup.Text
                    id='basic-addon1'
                    style={{
                        borderTopRightRadius: '10px',
                        borderBottomRightRadius: '10px',
                        cursor: "pointer",
                        backgroundColor: 'rgb(255, 223, 0)'
                    }}
                    onClick={query}
                >
                    <img
                        src={searchImage}
                        height='18'
                        alt='magnifying glass'
                    />
                </InputGroup.Text>
            </InputGroup>
        </Container>
    );
};

export default SearchBar;