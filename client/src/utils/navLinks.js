const navLinks = {
    explorer: [
        { name: 'Home', url: '/' },
        { name: 'Wallet', url: '/wallet/home' },
        { name: 'Faucet', url: '/faucet' },
    ],
    wallet: {
        locked: [
            { name: 'Explorer', url: '/' },
            { name: 'Create', url: '/wallet/home' },
            { name: 'Open', url: '/wallet/open' },
            { name: 'Faucet', url: '/faucet' }
        ],
        unlocked: [
            { name: 'Explorer', url: '/' },
            { name: 'Balance', url: '/wallet/balance' },
            { name: 'Send', url: '/wallet/send-tx' },
            { name: 'Faucet', url: '/faucet' },
            { name: 'Close Wallet'},
        ]
    },
    faucet: [
        { name: 'Explorer', url: '/' },
        { name: 'Wallet', url: '/wallet/home' },
    ]
};

module.exports = navLinks;