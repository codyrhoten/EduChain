const production = { url: 'https://educhain.codyrhoten.com'};
const development = { url: 'http://localhost:5555' };

export const config = process.env.NODE_ENV === 'development' ? development : production;