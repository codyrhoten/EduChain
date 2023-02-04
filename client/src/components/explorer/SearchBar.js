import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import explorer from '../../utils/explorer.js';
import { Container, Form, InputGroup } from 'react-bootstrap';
import searchImage from '../../assets/search.png';

const SearchBar = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [error, setError] = useState('');
    
    const query = () => {
        const result = explorer(search);

        if (result) {
            navigate(result);
            setSearch('');
        } else {
            setError('Query not found.');
            setSearch('');
        }
    };

    return (
        <Container>
            <Form.Label htmlFor='destination'>
                <i>School PoW Testnet Explorer</i>
            </Form.Label>
            {error && <p><i>{error}</i></p>}
            <InputGroup className='mb-3'>
                <Form.Control
                    aria-label='Large'
                    onChange={e => setSearch(e.target.value)}
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