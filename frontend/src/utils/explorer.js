const explorer = search => {
    search = search.trim();
    // ** ADD BACKEND CALLS TO VALIDATE SEARCH AGAINST EXISTING ADDRESSES,
    // BLOCK INDEXES AND TRANSACTION HASHES **

    // Check if the search is an address
    const address = /^[0-9a-f]{40}$/.test(search);
    // Check if the search is a hash
    const hash = /^[0-9a-f]{64}$/.test(search);
    // Check if the search is empty
    const empty = /^$/.test(search);

    if (empty) return false;

    if (address) return `/address/${search.toString()}`;
    // block hash
    // if (search.length < 40) {
    //     return `/block/${search.toString()}`;
    // }
    // tx hash
    if (hash) return `/tx/${search.toString()}`;
};

module.exports = explorer;