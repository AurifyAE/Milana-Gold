import React, { createContext, useState, useEffect, useContext } from "react";
import { getMarketData } from "../services/marketDataService";

const MarketDataContext = createContext();

const CURRENCY_CONFIG = [
  { id: "usd", defaultPrice: 3.6725, defaultChange: 0.0023, defaultIsUp: true },
  {
    id: "eur",
    defaultPrice: 4.2541,
    defaultChange: -0.0018,
    defaultIsUp: false,
  },
  { id: "gbp", defaultPrice: 4.9573, defaultChange: 0.0035, defaultIsUp: true },
];

const COMMODITY_CONFIG = [
  { id: "oil", defaultPrice: 78.59, defaultChange: 0.42, defaultIsUp: true },
  {
    id: "palladium",
    defaultPrice: 1032.45,
    defaultChange: 0.28,
    defaultIsUp: true,
  },
  {
    id: "platinum",
    defaultPrice: 1087.3,
    defaultChange: 0.36,
    defaultIsUp: true,
  },
  {
    id: "rhodium",
    defaultPrice: 5450.0,
    defaultChange: 0.5,
    defaultIsUp: true,
  }, // Rhodium is client-only static fallback
  { id: "btc", defaultPrice: 63251.62, defaultChange: 0.36, defaultIsUp: true },
  { id: "eth", defaultPrice: 3412.78, defaultChange: 0.5, defaultIsUp: true },
];

/**
 * Combined Context Provider to load all market data (forex & commodities)
 * using a single unified Twelve Data batch query.
 */
export const MarketDataProvider = ({ children }) => {
  const [rates, setRates] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    let active = true;
    let timerId;

    const fetchMarketData = async () => {
      try {
        console.log(
          "MarketContext: Fetching unified Twelve Data quote package...",
        );
        const data = await getMarketData();
        if (!active) return;
        console.log("MarketContext: Fetch successful:", data);
        setFetchError(null);

        setRates((prev) => {
          const nextRates = {};

          // Process Currencies
          CURRENCY_CONFIG.forEach((c) => {
            const apiItem = data[c.id];
            const price = apiItem ? apiItem.price : c.defaultPrice;
            const change = apiItem ? apiItem.change : c.defaultChange;

            nextRates[c.id] = {
              price,
              change,
              isUp: change > 0,
              isNeutral: change === 0,
            };
          });

          // Process Commodities & Cryptos
          COMMODITY_CONFIG.forEach((c) => {
            const apiItem = data[c.id];
            const price = apiItem ? apiItem.price : c.defaultPrice;
            const change = apiItem ? apiItem.change : c.defaultChange;

            nextRates[c.id] = {
              price,
              change,
              isUp: change > 0,
              isNeutral: change === 0,
            };
          });

          return nextRates;
        });

        setLastUpdated(new Date());
      } catch (err) {
        if (!active) return;
        console.error(
          "MarketContext: Combined fetch failed, using fallback data:",
          err,
        );
        setFetchError(err.message || "Failed to fetch live market data");

        // Resilient fallback state setup
        setRates((prev) => {
          if (!prev) {
            const fallbackRates = {};
            [...CURRENCY_CONFIG, ...COMMODITY_CONFIG].forEach((c) => {
              fallbackRates[c.id] = {
                price: c.defaultPrice,
                change: c.defaultChange,
                isUp: c.defaultIsUp,
                isNeutral: false,
              };
            });
            return fallbackRates;
          }
          return prev;
        });
      }
    };

    // Debounce the initial fetch by 100ms. In React StrictMode (development),
    // components are double-mounted. Debouncing clears the first mount's timer,
    // firing exactly one API call and preventing a 429 rate limit error on boot.
    timerId = setTimeout(() => {
      fetchMarketData();
    }, 100);

    // 15-minute refresh is mathematically safe for 24/7 free tier (consuming 768 of 800 daily credits)
    const interval = setInterval(fetchMarketData, 15 * 60 * 1000);

    return () => {
      active = false;
      clearTimeout(timerId);
      clearInterval(interval);
    };
  }, []);

  return (
    <MarketDataContext.Provider value={{ rates, lastUpdated, fetchError }}>
      {children}
    </MarketDataContext.Provider>
  );
};

export const useMarketData = () => useContext(MarketDataContext);
