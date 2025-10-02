import { CryptoData } from '../types/crypto';

const API_KEY = import.meta.env.VITE_COINGECKO_API_KEY || '';
const BASE_URL = 'https://api.coingecko.com/api/v3';

const getHeaders = () => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (API_KEY) {
    headers['x-cg-demo-api-key'] = API_KEY;
  }

  return headers;
};

export const fetchTopCryptos = async (currency: string = 'usd', perPage: number = 100): Promise<CryptoData[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${perPage}&page=1&sparkline=false`,
      { headers: getHeaders() }
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    throw error;
  }
};

export const searchCrypto = async (query: string): Promise<CryptoData[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false`,
      { headers: getHeaders() }
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    const lowercaseQuery = query.toLowerCase();

    return data.filter((crypto: CryptoData) =>
      crypto.name.toLowerCase().includes(lowercaseQuery) ||
      crypto.symbol.toLowerCase().includes(lowercaseQuery)
    );
  } catch (error) {
    console.error('Error searching crypto:', error);
    throw error;
  }
};
