const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetches all currency and commodity rates from Twelve Data API using a single batch request.
 * Implements a 10s timeout, response validation, and auto-retry on failure.
 *
 * @param {number} retries Number of retries on failure (defaults to 1)
 * @returns {Promise<Object>} Object containing normalized prices and changes for all symbols.
 */
export const getMarketData = async (retries = 1) => {
  const apiKey = import.meta.env.VITE_TWELVEDATA_API_KEY;

  if (!apiKey || apiKey === "YOUR_NEW_API_KEY") {
    throw new Error(
      "Twelve Data API key is missing. Please set VITE_TWELVEDATA_API_KEY in your .env file.",
    );
  }

  // Combine all symbols in a single request to stay within free plan limits
  const symbols = [
    "USD/AED",
    "EUR/AED",
    "GBP/AED", // Currencies
    "WTI/USD",
    "XPD/USD",
    "XPT/USD",
    "BTC/USD",
    "ETH/USD", // Commodities & Cryptos
  ];

  const url = `https://api.twelvedata.com/quote?symbol=${symbols.join(",")}&apikey=${apiKey}`;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10-second timeout

    try {
      const res = await fetch(url, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`Twelve Data API returned status ${res.status}`);
      }

      const data = await res.json();

      if (data.status === "error" || data.code >= 400) {
        throw new Error(
          data.message || "Twelve Data API returned error response",
        );
      }

      const results = {};

      // Parse Currencies
      const usdPair = data["USD/AED"];
      const eurPair = data["EUR/AED"];
      const gbpPair = data["GBP/AED"];

      if (usdPair?.close && eurPair?.close && gbpPair?.close) {
        results.usd = {
          price: Number(usdPair.close),
          change: Number(usdPair.change),
        };
        results.eur = {
          price: Number(eurPair.close),
          change: Number(eurPair.change),
        };
        results.gbp = {
          price: Number(gbpPair.close),
          change: Number(gbpPair.change),
        };
      }

      // Parse Commodities & Cryptos
      const commoditiesList = [
        { key: "oil", symbol: "WTI/USD" },
        { key: "palladium", symbol: "XPD/USD" },
        { key: "platinum", symbol: "XPT/USD" },
        { key: "btc", symbol: "BTC/USD" },
        { key: "eth", symbol: "ETH/USD" },
      ];

      commoditiesList.forEach(({ key, symbol }) => {
        const item = data[symbol];
        if (item && item.close) {
          results[key] = {
            price: Number(item.close),
            change: Number(item.percent_change) || 0,
          };
        }
      });

      return results;
    } catch (error) {
      clearTimeout(timeoutId);
      console.warn(
        `Twelve Data batch market fetch attempt ${attempt + 1} failed:`,
        error.message,
      );

      if (attempt < retries) {
        console.log("Retrying Twelve Data batch fetch in 2 seconds...");
        await wait(2000);
      } else {
        throw new Error(
          `Twelve Data API failed after ${retries + 1} attempts: ${error.message}`,
        );
      }
    }
  }
};
