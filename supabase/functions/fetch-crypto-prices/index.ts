// @deno-types="https://esm.sh/@supabase/supabase-js@2"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface CryptoData {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  max_supply: number | null;
  circulating_supply: number | null;
  total_supply: number | null;
  quote: {
    USD: {
      price: number;
      market_cap: number;
      volume_24h: number;
      percent_change_1h: number;
      percent_change_24h: number;
      percent_change_7d: number;
      percent_change_30d: number;
    };
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse query parameters
    const url = new URL(req.url);
    const limit = url.searchParams.get('limit') || '100';
    const apiKey = url.searchParams.get('apiKey');

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'CoinMarketCap API key is required. Pass it as ?apiKey=YOUR_KEY' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Fetch from CoinMarketCap API
    const cmcResponse = await fetch(
      `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=${limit}&convert=USD`,
      {
        headers: {
          'X-CMC_PRO_API_KEY': apiKey,
          'Accept': 'application/json',
        },
      }
    );

    if (!cmcResponse.ok) {
      const errorText = await cmcResponse.text();
      return new Response(
        JSON.stringify({ 
          error: 'Failed to fetch from CoinMarketCap', 
          details: errorText,
          status: cmcResponse.status
        }),
        {
          status: cmcResponse.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const cmcData = await cmcResponse.json();
    const cryptos: CryptoData[] = cmcData.data;

    // Process and store data
    let insertedCount = 0;
    let updatedCount = 0;
    let errors: string[] = [];

    for (const crypto of cryptos) {
      try {
        // Upsert cryptocurrency
        const { data: existingCrypto, error: selectError } = await supabase
          .from('cryptocurrencies')
          .select('id')
          .eq('cmc_id', crypto.id)
          .maybeSingle();

        if (selectError) {
          errors.push(`Select error for ${crypto.name}: ${selectError.message}`);
          continue;
        }

        let cryptoId: string;

        if (existingCrypto) {
          // Update existing
          const { error: updateError } = await supabase
            .from('cryptocurrencies')
            .update({
              name: crypto.name,
              symbol: crypto.symbol,
              slug: crypto.slug,
              max_supply: crypto.max_supply,
              circulating_supply: crypto.circulating_supply,
              total_supply: crypto.total_supply,
              logo_url: `https://s2.coinmarketcap.com/static/img/coins/64x64/${crypto.id}.png`,
              updated_at: new Date().toISOString(),
            })
            .eq('cmc_id', crypto.id);

          if (updateError) {
            errors.push(`Update error for ${crypto.name}: ${updateError.message}`);
            continue;
          }
          cryptoId = existingCrypto.id;
          updatedCount++;
        } else {
          // Insert new
          const { data: newCrypto, error: insertError } = await supabase
            .from('cryptocurrencies')
            .insert({
              cmc_id: crypto.id,
              name: crypto.name,
              symbol: crypto.symbol,
              slug: crypto.slug,
              max_supply: crypto.max_supply,
              circulating_supply: crypto.circulating_supply,
              total_supply: crypto.total_supply,
              logo_url: `https://s2.coinmarketcap.com/static/img/coins/64x64/${crypto.id}.png`,
              created_at: new Date().toISOString(),
            })
            .select('id')
            .single();

          if (insertError || !newCrypto) {
            errors.push(`Insert error for ${crypto.name}: ${insertError?.message || 'No data returned'}`);
            continue;
          }
          cryptoId = newCrypto.id;
          insertedCount++;
        }

        // Insert price data
        const { error: priceError } = await supabase
          .from('crypto_prices')
          .insert({
            crypto_id: cryptoId,
            price_usd: crypto.quote.USD.price,
            market_cap: crypto.quote.USD.market_cap,
            volume_24h: crypto.quote.USD.volume_24h,
            percent_change_1h: crypto.quote.USD.percent_change_1h,
            percent_change_24h: crypto.quote.USD.percent_change_24h,
            percent_change_7d: crypto.quote.USD.percent_change_7d,
            percent_change_30d: crypto.quote.USD.percent_change_30d,
            rank: cryptos.indexOf(crypto) + 1,
            timestamp: new Date().toISOString(),
          });

        if (priceError) {
          errors.push(`Price insert error for ${crypto.name}: ${priceError.message}`);
        }

      } catch (cryptoError) {
        errors.push(`Unexpected error processing ${crypto.name}: ${cryptoError instanceof Error ? cryptoError.message : 'Unknown error'}`);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Processed ${cryptos.length} cryptocurrencies`,
        inserted: insertedCount,
        updated: updatedCount,
        errors: errors.length > 0 ? errors : undefined,
        total_errors: errors.length,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});