const production = { url: 'https://edu-chain-api.vercel.app'};
const development = { url: 'http://localhost:5555' };

export const config = process.env.NODE_ENV === 'development' ? development : production;