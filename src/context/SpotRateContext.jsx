// SpotRateContext.js
import { createContext, useContext, useState, useCallback } from "react";

const SpotRateContext = createContext();

export const SpotRateProvider = ({ children }) => {
  const [goldData, setGoldData] = useState({ bid: 0, ask: 0 });
  const [silverData, setSilverData] = useState({ bid: 0, ask: 0 });

  const calculateValues = (
    bid = 0,
    bidSpread = 0,
    askSpread = 0,
    offset = 0,
    precision = 2,
  ) => {
    const bidValue = Number(bid) + Number(bidSpread);
    const askValue = bidValue + Number(askSpread) + Number(offset);
    return {
      bid: bidValue.toFixed(precision),
      ask: askValue.toFixed(precision),
    };
  };

  const updateMarketData = useCallback((
    marketData,
    goldBidSpread = 0,
    goldAskSpread = 0,
    silverBidSpread = 0,
    silverAskSpread = 0,
  ) => {
    if (!marketData || typeof marketData !== "object") {
      return;
    }

    // Flexible case-insensitive retrieval
    const goldItem =
      marketData.Gold ||
      marketData.GOLD ||
      marketData.gold ||
      Object.values(marketData).find(
        (m) =>
          m?.symbol?.toLowerCase() === "gold" ||
          m?.epic?.toLowerCase() === "gold",
      );

    const silverItem =
      marketData.Silver ||
      marketData.SILVER ||
      marketData.silver ||
      Object.values(marketData).find(
        (m) =>
          m?.symbol?.toLowerCase() === "silver" ||
          m?.epic?.toLowerCase() === "silver",
      );

    if (goldItem && (goldItem.bid || goldItem.offer)) {
      const rawBid = goldItem.bid || goldItem.offer;
      const goldValues = calculateValues(
        rawBid,
        goldBidSpread,
        goldAskSpread,
        0.5,
      );

      setGoldData({
        bid: goldValues?.bid,
        ask: goldValues?.ask,
        low: goldItem.low,
        high: goldItem.high,
        initialBid: goldItem.initialBid || goldItem.low,
      });
    }

    if (silverItem && (silverItem.bid || silverItem.offer)) {
      const rawBid = silverItem.bid || silverItem.offer;
      const silverValues = calculateValues(
        rawBid,
        silverBidSpread,
        silverAskSpread,
        0.05,
        3,
      );

      setSilverData({
        bid: silverValues?.bid,
        ask: silverValues?.ask,
        low: silverItem.low,
        high: silverItem.high,
        initialBid: silverItem.initialBid || silverItem.low,
      });
    }
  }, []);

  return (
    <SpotRateContext.Provider
      value={{ goldData, silverData, updateMarketData }}
    >
      {children}
    </SpotRateContext.Provider>
  );
};

export const useSpotRate = () => useContext(SpotRateContext);
