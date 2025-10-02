# Crypto Price Tracker

Aplikasi web sederhana untuk melacak harga cryptocurrency secara real-time, mirip dengan CoinMarketCap atau CoinGecko.

## Fitur

- Menampilkan 100 cryptocurrency teratas berdasarkan market cap
- Real-time price updates setiap 60 detik
- Search dan filter cryptocurrency
- Statistik global (Total Market Cap, 24h Volume, BTC Dominance)
- Design responsive dan modern
- Support Docker deployment

## Teknologi

- React + TypeScript
- Vite
- Tailwind CSS
- CoinGecko API
- Docker & Docker Compose

## Setup Development

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Edit file `.env` dan masukkan API key CoinGecko Anda:
```
VITE_COINGECKO_API_KEY=your_api_key_here
```

3. Jalankan development server:
```bash
npm run dev
```

## Setup dengan Docker

1. Pastikan Docker dan Docker Compose sudah terinstall

2. Configure environment variables:
Edit file `.env` dan masukkan API key CoinGecko Anda:
```
VITE_COINGECKO_API_KEY=your_api_key_here
```

3. Build dan jalankan container:
```bash
docker-compose up --build
```

4. Akses aplikasi di browser:
```
http://localhost:3000
```

## Mendapatkan CoinGecko API Key

1. Kunjungi https://www.coingecko.com/en/api
2. Daftar untuk mendapatkan free API key
3. Copy API key dan masukkan ke file `.env`

**Note:** Aplikasi tetap bisa berjalan tanpa API key, namun dengan rate limit yang lebih rendah.

## Docker Commands

Start aplikasi:
```bash
docker-compose up
```

Start di background:
```bash
docker-compose up -d
```

Stop aplikasi:
```bash
docker-compose down
```

Rebuild container:
```bash
docker-compose up --build
```

View logs:
```bash
docker-compose logs -f
```

## Build untuk Production

```bash
npm run build
```

Output akan berada di folder `dist/`

## Environment Variables

- `VITE_COINGECKO_API_KEY` - CoinGecko API key (optional, tapi direkomendasikan)
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key

## License

MIT
