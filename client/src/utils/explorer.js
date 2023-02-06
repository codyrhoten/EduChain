import axios from 'axios';

const explorer = async search => {
    search = search.trim();

    // Check if the search is empty
    if (search === '') return false;

    // Check if the search is an address
    const address = /^[0-9a-f]{40}$/.test(search);
    if (address) return `/address/${search}`;

    // Check if the search is a tx by hash
    try {
        const tx = await axios.get(`http:/localhost:5555/txs/${search}`)
        if (!tx.data.errorMsg) return `/tx/${search}`;
    } catch (err) {
        console.log(err.message);

        try {
            // Check if the search is a block by index
            const block = await axios.get(`http://localhost:5555/blocks/${search}`);
            if (!block.data.errorMsg) return `/block/${search.toString()}`;
        } catch (err) {
            console.log(err);
            return false;
        }
    }


};

export default explorer;