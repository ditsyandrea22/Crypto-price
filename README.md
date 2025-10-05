# CryptoTracker - Real-Time Cryptocurrency Price Tracker

A production-ready cryptocurrency price tracking application similar to CoinMarketCap, built with React, TypeScript, Tailwind CSS, and Supabase.


## Features

- **Real-time cryptocurrency prices** — Track live prices from CoinMarketCap
- **Market statistics** — View market cap, 24h volume, BTC dominance
- **Price changes** — Monitor 1h, 24h, 7d, and 30d price changes
- **Search functionality** — Easily find cryptocurrencies by name or symbol
- **Responsive design** — Beautiful UI that works on all devices
- **Dark mode** — Toggle dark/light mode for comfortable viewing (🌙/☀️ button di pojok kanan atas)
- **Modern UX** — Animasi halus, empty/error state, dan loading state yang menarik
- **Real-time updates** — Automatic data refresh with Supabase subscriptions

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Deployment**: Docker + Nginx

## Getting Started

### Prerequisites

- Node.js 20+
- Docker (for containerized deployment)
- CoinMarketCap API key (free tier available)
- Supabase account


### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Environment variables are already configured in `.env`
4. Start the development server:
   ```bash
   npm run dev
   ```

### UI/UX Tips

- Untuk mengaktifkan **dark mode**, klik tombol 🌙/☀️ di pojok kanan atas header.
- Aplikasi ini responsif dan nyaman digunakan di desktop maupun mobile.
- Empty state, error state, dan loading state didesain agar informatif dan menarik.

### Fetching Cryptocurrency Data

To populate the database with cryptocurrency prices:

1. Get a free API key from [CoinMarketCap](https://coinmarketcap.com/api/)

2. Call the edge function:
   ```bash
   curl "https://nwqxgiyyptoepyqiokfw.supabase.co/functions/v1/fetch-crypto-prices?apiKey=YOUR_API_KEY&limit=100"
   ```

3. The app will automatically refresh with the new data

## Docker Deployment

### Build and Run with Docker

```bash
# Build the Docker image
docker build -t cryptotracker .

# Run the container
docker run -p 3000:80 cryptotracker
```

### Using Docker Compose

```bash
# Start the application
docker-compose up -d

# Stop the application
docker-compose down
```

The application will be available at `http://localhost:3000`

## Database Schema

The application uses three main tables:

- **cryptocurrencies** - Stores cryptocurrency information (name, symbol, supply, etc.)
- **crypto_prices** - Stores price history and market data
- **user_watchlists** - User favorites (requires authentication)

## Edge Functions

- **fetch-crypto-prices** - Fetches and stores cryptocurrency data from CoinMarketCap API

## Build for Production

```bash
npm run build
```

The production build will be created in the `dist` directory.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Check TypeScript types

## License

MIT
