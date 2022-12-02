import axios from 'axios';

const explorer = async search => {
    search = search.trim();

    // Check if the search is an address
    const address = /^[0-9a-f]{40}$/.test(search);
    if (address) return `/address/${search.toString()}`;

    // Check if the search is empty
    const empty = /^$/.test(search);
    if (empty) return false;

    // Check if the search is a tx by hash
    const hash = /^[0-9a-f]{64}$/.test(search);
    if (hash) return `/tx/${search.toString()}`;

    // Check if the search is a block by index
    const blockchain = await axios.get('http://localhost:3333/blockchain');
    const block = blockchain.data.chain[Number(search)];
    if (block) return `/block/${search.toString()}`;
};

module.exports = explorer;