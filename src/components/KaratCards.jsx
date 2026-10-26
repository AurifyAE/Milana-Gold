import { useEffect, useRef, useState, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { useSpotRate } from "../context/SpotRateContext";

const OUNCE = 31.103;
const SAR = 3.75;

const KARAT_CONFIG = [
  { key: "24k", label: "24K", purityLabel: "999.9", purity: 0.999, purityInt: 999 },
  { key: "22k", label: "22K", purityLabel: "916", purity: 22 / 24, purityInt: 916 },
  { key: "21k", label: "21K", purityLabel: "875", purity: 21 / 24, purityInt: 875 },
  { key: "18k", label: "18K", purityLabel: "750", purity: 18 / 24, purityInt: 750 },
];

const formatPrice = (val, decimals = 2) => {
  if (val == null || isNaN(val) || val <= 0) return null;
  return Number(val).toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

const KaratCards = ({ commodities = [] }) => {
  const { goldData } = useSpotRate();

  const spotBid = Number(goldData?.bid) || 0;
  const spotAsk = Number(goldData?.ask) || 0;
  const isLoaded = spotBid > 0 && spotAsk > 0;

  // Track price directions for micro-pulse
  const [directions, setDirections] = useState({
    "24k": "neutral",
    "22k": "neutral",
    "21k": "neutral",
    "18k": "neutral",
  });

  const prevRatesRef = useRef({});

  // Compute rates for each karat
  const karatRates = useMemo(() => {
    return KARAT_CONFIG.map((k) => {
      const matchingComm = commodities?.find((c) => {
        const pur = Number(c.purity);
        return (
          pur === k.purityInt ||
          (k.key === "24k" && (pur === 999 || pur === 9999 || pur === 1000))
        );
      });

      const buyPremium = Number(matchingComm?.buyPremium) || 0;
      const sellPremium = Number(matchingComm?.sellPremium) || 0;
      const buyCharge = Number(matchingComm?.buyCharge) || 0;
      const sellCharge = Number(matchingComm?.sellCharge) || 0;

      let ask = null;
      let bid = null;

      if (isLoaded) {
        bid = ((spotBid + buyPremium) / OUNCE) * SAR * k.purity + buyCharge;
        ask = ((spotAsk + sellPremium) / OUNCE) * SAR * k.purity + sellCharge;
      }

      return {
        ...k,
        ask,
        bid,
        askFormatted: formatPrice(ask),
        bidFormatted: formatPrice(bid),
      };
    });
  }, [commodities, isLoaded, spotBid, spotAsk]);

  // Micro flash on price update
  useEffect(() => {
    if (!isLoaded) return;

    karatRates.forEach((item) => {
      const prev = prevRatesRef.current[item.key];
      if (prev != null && item.ask != null) {
        if (item.ask > prev) {
          setDirections((d) => ({ ...d, [item.key]: "rise" }));
          const t = setTimeout(() => {
            setDirections((d) => ({ ...d, [item.key]: "neutral" }));
          }, 700);
          return () => clearTimeout(t);
        } else if (item.ask < prev) {
          setDirections((d) => ({ ...d, [item.key]: "fall" }));
          const t = setTimeout(() => {
            setDirections((d) => ({ ...d, [item.key]: "neutral" }));
          }, 700);
          return () => clearTimeout(t);
        }
      }
      if (item.ask != null) {
        prevRatesRef.current[item.key] = item.ask;
      }
    });
  }, [karatRates, isLoaded]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gridTemplateRows: "repeat(2, 1fr)",
        gap: "1.2cqi",
        alignItems: "stretch",
      }}
    >
      {karatRates.map((item) => {
        const dir = directions[item.key];
        const isPulse = dir !== "neutral";

        let borderGlow = "rgba(229, 197, 131, 0.35)";
        let glowShadow =
          "0 1cqi 2.5cqi rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 237, 165, 0.22)";

        if (isPulse) {
          if (dir === "rise") {
            borderGlow = "rgba(61, 220, 132, 0.85)";
            glowShadow =
              "0 0 1.6cqi rgba(61, 220, 132, 0.35), inset 0 1px 0 rgba(255, 237, 165, 0.25)";
          } else if (dir === "fall") {
            borderGlow = "rgba(255, 77, 77, 0.85)";
            glowShadow =
              "0 0 1.6cqi rgba(255, 77, 77, 0.35), inset 0 1px 0 rgba(255, 237, 165, 0.25)";
          }
        }

        return (
          <Box
            key={item.key}
            sx={{
              position: "relative",
              overflow: "hidden",
              borderRadius: "1.4cqi",
              background:
                "linear-gradient(180deg, rgba(48, 12, 25, 0.88) 0%, rgba(26, 6, 15, 0.94) 50%, rgba(14, 3, 9, 0.98) 100%)",
              backdropFilter: "blur(20px)",
              border: `1px solid ${borderGlow}`,
              boxShadow: glowShadow,
              transition: "border 0.35s ease, box-shadow 0.35s ease",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
              py: "1.2cqi",
              px: "1.4cqi",
              height: "100%",
              boxSizing: "border-box",
              // Elegant top golden specular highlight
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: "15%",
                right: "15%",
                height: "2px",
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255, 237, 165, 0.9) 50%, transparent 100%)",
              },
            }}
          >
            {/* Top Row: Karat Title & Purity Badge */}
            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: "0.2cqi",
              }}
            >
              <Typography
                className="font-cinzel"
                sx={{
                  fontSize: "2.6cqi",
                  fontWeight: 800,
                  color: "#FFEDA5", // Champagne Gold
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  lineHeight: 1,
                  textShadow: "0 2px 8px rgba(0, 0, 0, 0.8)",
                }}
              >
                GOLD {item.label}
              </Typography>

              <Box
                sx={{
                  bgcolor: "rgba(255, 237, 165, 0.08)",
                  border: "1px solid rgba(229, 197, 131, 0.22)",
                  borderRadius: "2cqi",
                  px: "0.9cqi",
                  py: "0.15cqi",
                }}
              >
                <Typography
                  className="font-numbers"
                  sx={{
                    fontSize: "1.3cqi",
                    fontWeight: 600,
                    color: "rgba(255, 237, 165, 0.85)",
                    letterSpacing: "0.06em",
                  }}
                >
                  {item.purityLabel}
                </Typography>
              </Box>
            </Box>

            {/* Center Section: Main Ask Price + Currency Indicator */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                my: "auto",
                py: "0.2cqi",
              }}
            >
              {isLoaded && item.askFormatted ? (
                <>
                  {/* Retail Rate */}
                  <Typography
                    className="font-numbers"
                    sx={{
                      fontSize: "3.8cqi",
                      fontWeight: 800,
                      color: "#FFFFFF",
                      letterSpacing: "-0.01em",
                      lineHeight: 1,
                      textShadow: "0 2px 10px rgba(0,0,0,0.85)",
                    }}
                  >
                    {item.askFormatted}
                  </Typography>

                  {/* Currency Badge: ر.س SAR / GM */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "baseline",
                      justifyContent: "center",
                      gap: "0.5cqi",
                      mt: "0.4cqi",
                    }}
                  >
                    <Typography
                      className="font-gilda"
                      sx={{
                        fontSize: "2.2cqi",
                        fontWeight: 700,
                        color: "#FFEDA5",
                        lineHeight: 1,
                      }}
                    >
                      ر.س
                    </Typography>
                    <Typography
                      className="font-numbers"
                      sx={{
                        fontSize: "1.5cqi",
                        fontWeight: 700,
                        color: "rgba(255, 237, 165, 0.85)",
                        letterSpacing: "0.06em",
                      }}
                    >
                      SAR / GM
                    </Typography>
                  </Box>
                </>
              ) : (
                <Typography
                  className="font-numbers"
                  sx={{
                    fontSize: "2.4cqi",
                    fontWeight: 700,
                    color: "rgba(255, 237, 165, 0.75)",
                    letterSpacing: "0.05em",
                    animation: "pulse 1.8s infinite ease-in-out",
                  }}
                >
                  Loading...
                </Typography>
              )}
            </Box>

            {/* Bottom Section: Buyback Capsule (BID) */}
            <Box
              sx={{
                width: "95%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                bgcolor: "rgba(0, 0, 0, 0.45)",
                border: "1px solid rgba(229, 197, 131, 0.22)",
                borderRadius: "0.8cqi",
                px: "1.2cqi",
                py: "0.45cqi",
                boxSizing: "border-box",
                boxShadow: "inset 0 1px 4px rgba(0, 0, 0, 0.4)",
              }}
            >
              <Typography
                className="font-numbers"
                sx={{
                  fontSize: "1.5cqi",
                  fontWeight: 700,
                  color: "rgba(255, 237, 165, 0.75)",
                  letterSpacing: "0.06em",
                }}
              >
                BID:
              </Typography>
              <Typography
                className="font-numbers"
                sx={{
                  fontSize: "2cqi",
                  fontWeight: 800,
                  color: "#FFFFFF",
                  letterSpacing: "0.02em",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {item.bidFormatted || item.askFormatted || "--"}
              </Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default KaratCards;

