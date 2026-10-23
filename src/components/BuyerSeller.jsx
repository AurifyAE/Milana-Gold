import React, { useEffect, useState, useRef } from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { useSpotRate } from "../context/SpotRateContext";

// Project Deep Burgundy & Gold Glassmorphic Card Container
const MarketData = styled(Box)(({ theme }) => ({
  position: "relative",
  overflow: "hidden",
  backgroundColor: "rgba(58, 14, 30, 0.65)",
  backdropFilter: "blur(0.8vw)",
  borderRadius: "1.2vw",
  boxShadow: "0 0.8vw 2vw rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 237, 165, 0.15)",
  padding: theme.spacing(2),
  width: "100%",
  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    padding: "1px", // Border thickness
    borderRadius: "inherit",
    background: `
            linear-gradient(
                135deg,
                rgba(255, 237, 165, 0.45) 0%,
                rgba(200, 160, 80, 0.15) 50%,
                rgba(255, 237, 165, 0.35) 100%
            )
        `,
    WebkitMask: `
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0)
        `,
    WebkitMaskComposite: "xor",
    maskComposite: "exclude",
    pointerEvents: "none",
  },
}));

const MarketDataRow = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(1),
}));

const MarketDataBar = styled(Box)({
  display: "flex",
  height: "10px",
  borderRadius: "5px",
  overflow: "hidden",
  marginBottom: "8px",
  backgroundColor: "rgba(0, 0, 0, 0.4)",
  border: "1px solid rgba(229, 197, 131, 0.15)",
});

const BuyersBar = styled(Box)({
  height: "100%",
  background: "linear-gradient(90deg, #008080 0%, #4CBF00 100%)",
  transition: "width 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
});

const SellersBar = styled(Box)({
  height: "100%",
  background: "linear-gradient(90deg, #FF0040 0%, #B3002D 100%)",
  transition: "width 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
});

const BuyerSeller = ({
  buyers: propBuyers,
  sellers: propSellers,
  spreadRatio: propSpreadRatio,
  autoUpdate = true,
}) => {
  const spotRateContext = useSpotRate();
  const goldData = spotRateContext?.goldData;

  const [buyerPercent, setBuyerPercent] = useState(propBuyers ?? 81);
  const [sellerPercent, setSellerPercent] = useState(propSellers ?? 19);
  const [spreadVal, setSpreadVal] = useState(propSpreadRatio ?? "0.080%");

  // Update dynamic calculations based on props or spotRate changes
  useEffect(() => {
    if (propBuyers !== undefined && propSellers !== undefined) {
      setBuyerPercent(propBuyers);
      setSellerPercent(propSellers);
      return;
    }

    if (goldData?.bid && goldData?.ask) {
      const bid = parseFloat(goldData.bid);
      const ask = parseFloat(goldData.ask);
      if (!isNaN(bid) && !isNaN(ask) && bid > 0) {
        const spreadPct = (((ask - bid) / bid) * 100).toFixed(3);
        setSpreadVal(`${spreadPct}%`);
      }
    }
  }, [propBuyers, propSellers, goldData?.bid, goldData?.ask]);

  const start15mPriceRef = useRef(null);
  const currentPriceRef = useRef(null);

  // Keep track of incoming live gold bid silently in background
  useEffect(() => {
    if (goldData?.bid) {
      const bid = parseFloat(goldData.bid);
      if (!isNaN(bid) && bid > 0) {
        currentPriceRef.current = bid;
        // Store initial start price if not set
        if (start15mPriceRef.current === null) {
          start15mPriceRef.current = bid;
        }
      }
    }
  }, [goldData?.bid]);

  // Recalculate momentum ONLY ONCE EVERY 15 MINUTES
  useEffect(() => {
    if (propBuyers !== undefined && propSellers !== undefined) return;
    if (!autoUpdate) return;

    const FIFTEEN_MINUTES_MS = 15 * 60 * 1000; // 900,000 ms

    const interval = setInterval(() => {
      const startPrice = start15mPriceRef.current;
      const currentPrice = currentPriceRef.current;

      if (startPrice && currentPrice && startPrice > 0) {
        const diff = currentPrice - startPrice;
        const pctChange = (diff / startPrice) * 100;

        // Calculate 15-minute momentum (centered at 50% neutral base)
        const newBuyerPct = Math.min(88, Math.max(15, Math.round(50 + pctChange * 200)));
        setBuyerPercent(newBuyerPct);
        setSellerPercent(100 - newBuyerPct);
      }

      // Reset baseline start price for the NEXT 15-minute block
      if (currentPrice) {
        start15mPriceRef.current = currentPrice;
      }
    }, FIFTEEN_MINUTES_MS);

    return () => clearInterval(interval);
  }, [autoUpdate, propBuyers, propSellers]);

  const displayBuyers = Math.round(buyerPercent);
  const displaySellers = Math.round(sellerPercent);

  return (
    <MarketData sx={{ marginTop: "10px" }}>
      <MarketDataRow className="mb-2">
        <Typography
          variant="body2"
          sx={{
            color: "#E5C583",
            fontSize: "1.2vw",
            fontWeight: 700,
            letterSpacing: "0.08em",
          }}
        >
          BUYERS
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "#4CBF00",
            fontSize: "1.2vw",
            fontWeight: 700,
            letterSpacing: "0.05em",
          }}
        >
          {propSpreadRatio ?? spreadVal}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "#E5C583",
            fontSize: "1.2vw",
            fontWeight: 700,
            letterSpacing: "0.08em",
          }}
        >
          SELLER
        </Typography>
      </MarketDataRow>

      <MarketDataBar className="mb-2">
        <BuyersBar style={{ width: `${displayBuyers}%` }} />
        <SellersBar style={{ width: `${displaySellers}%` }} />
      </MarketDataBar>

      <MarketDataRow>
        <Typography
          variant="body2"
          sx={{
            color: "#EAEFF5",
            fontSize: "1.2vw",
            fontWeight: 700,
            letterSpacing: "0.05em",
          }}
        >
          {displayBuyers}%
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "#EAEFF5",
            fontSize: "1.2vw",
            fontWeight: 700,
            letterSpacing: "0.05em",
          }}
        >
          {displaySellers}%
        </Typography>
      </MarketDataRow>
    </MarketData>
  );
};

export default BuyerSeller;