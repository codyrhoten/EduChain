const production = { 
    apiUrl: 'https://edu-chain-api.vercel.app',
    frontEndUrl: 'https://educhain.codyrhoten.com'
};
const development = { 
    apiUrl: 'http://localhost:5555',
    frontEndUrl: 'http://localhost:3000'
};

export const config = process.env.NODE_ENV === 'development' ? development : production;