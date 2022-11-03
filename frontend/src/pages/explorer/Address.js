import Header from "../../components/Header";
import { Card, Container } from "react-bootstrap";
import SearchBar from "../../components/explorer/SearchBar";

const Address = () => {
    return (
        <>
            <Header />
            <Container>
                <SearchBar />
                <h4 align='center'>Address: </h4>
                <Card>
                    <Card.Body>
                        Balance: ___ coins
                    </Card.Body>
                    <Table responsive>
                        <thead>
                            <tr>
                                <th></th>
                                <td></td>
                            </tr>
                        </thead>
                    </Table>
                </Card>
            </Container>
        </>
    );
};

export default Address;