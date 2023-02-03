const navLinks = {
    explorer: [
        { name: 'Home', url: '/' },
        { name: 'Wallet', url: '/wallet/home' },
        { name: 'Faucet', url: '/faucet' },
        { name: 'Miner', url: '/miner' },
    ],
    wallet: {
        locked: [
            { name: 'Explorer', url: '/' },
            { name: 'Home', url: '/wallet/home' },
            { name: 'Create', url: '/wallet/create' },
            { name: 'Open', url: '/wallet/open' }
        ],
        unlocked: [
            { name: 'Explorer', url: '/' },
            { name: 'Balance', url: '/wallet/balance' },
            { name: 'Send Transaction', url: '/wallet/send-tx' },
            { name: 'Close Wallet'},
        ]
    },
    faucet: [
        { name: 'Explorer', url: '/' },
        { name: 'Wallet', url: '/wallet/home' },
        { name: 'Miner', url: '/miner' },
    ],
    miner: [
        { name: 'Home', url: '/' },
        { name: 'Wallet', url: '/wallet/home' },
        { name: 'Faucet', url: '/faucet' },
    ],
};

module.exports = navLinks;