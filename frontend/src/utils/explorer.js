const explorer = search => {
    search = search.trim();
    // Check if the search is an address
    const address = /^[0-9a-f]{40}$/.test(search);
    // Check if the search is a hash
    const hash = /^[0-9a-f]{64}$/.test(search);
    // Check if the search is empty
    const empty = /^$/.test(search);

    if (empty) return false;

    if (address) return `/explorer/addresses/${search.toString()}`;
    // block hash
    if (search.startsWith("0000")) {
        return `/explorer/blocks/${search.toString()}`;
    }
    // transaction hash
    if (hash) return `/explorer/transactions/${search.toString()}`;
};

export default explorer;