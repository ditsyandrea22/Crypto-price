# CryptoTracker - Real-time Cryptocurrency Price Tracker

A beautiful, real-time cryptocurrency price tracking application similar to CoinMarketCap and CoinGecko, built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

- Real-time cryptocurrency prices from top 100 coins
- Live search functionality
- Auto-refresh every 60 seconds
- Beautiful, responsive UI
- Market cap rankings
- 24h price changes with visual indicators
- Market data including volume, supply, and more
- Docker support for easy deployment

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL database)
- **API**: CoinGecko API
- **Deployment**: Docker, Nginx

## Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Supabase account (or use the provided .env configuration)

### Running with Docker

1. Clone the repository
2. Make sure your `.env` file is configured with Supabase credentials
3. Build and run with Docker Compose:

```bash
docker-compose up --build
```

4. Open your browser and navigate to `http://localhost:3000`

### Running Locally (Development)

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open your browser and navigate to the provided local URL

## Docker Commands

### Build the Docker image:
```bash
docker-compose build
```

### Run the container:
```bash
docker-compose up
```

### Run in detached mode:
```bash
docker-compose up -d
```

### Stop the container:
```bash
docker-compose down
```

### View logs:
```bash
docker-compose logs -f
```

## Environment Variables

The application requires the following environment variables (already configured in `.env`):

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database Schema

The application uses a Supabase PostgreSQL database with the following table:

- `cryptocurrencies` - Stores cryptocurrency data including prices, market cap, volume, and more

## Features in Detail

- **Live Data**: Fetches and updates cryptocurrency prices from CoinGecko API
- **Search**: Real-time search across cryptocurrency names and symbols
- **Auto-refresh**: Data automatically refreshes every 60 seconds
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Performance**: Optimized with caching and efficient database queries

## API Rate Limits

The application uses the free CoinGecko API which has rate limits. The app is configured to:
- Fetch top 100 cryptocurrencies
- Auto-refresh every 60 seconds
- Cache data in Supabase to reduce API calls

## Production Deployment

The Docker setup uses:
- Multi-stage build for optimized image size
- Nginx for serving static files
- Gzip compression for better performance
- Cache headers for static assets

## License

MIT
