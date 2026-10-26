import { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useSpotRate } from "../context/SpotRateContext";

const formatPrice = (val, decimals = 2) => {
  if (val == null || isNaN(val) || Number(val) <= 0) return null;
  return Number(val).toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

const RateBox = ({ label, value, dir, isSilver }) => {
  const isPulse = dir !== "neutral";

  let borderColor = isSilver
    ? "rgba(186, 200, 217, 0.3)"
    : "rgba(229, 197, 131, 0.32)";
  let shadow = "inset 0 2px 8px rgba(0, 0, 0, 0.5)";

  if (isPulse) {
    if (dir === "rise") {
      borderColor = "rgba(61, 220, 132, 0.85)";
      shadow =
        "0 0 1.8cqi rgba(61, 220, 132, 0.35), inset 0 2px 8px rgba(0, 0, 0, 0.5)";
    } else if (dir === "fall") {
      borderColor = "rgba(255, 77, 77, 0.85)";
      shadow =
        "0 0 1.8cqi rgba(255, 77, 77, 0.35), inset 0 2px 8px rgba(0, 0, 0, 0.5)";
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Label above the rate box */}
      <Typography
        className="font-numbers"
        sx={{
          fontSize: "2cqi",
          fontWeight: 800,
          color: isSilver ? "#BAC8D9" : "#FFEDA5",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          mb: "0.5cqi",
        }}
      >
        {label}
      </Typography>

      {/* Main Rate Container */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(180deg, rgba(46, 12, 24, 0.75) 0%, rgba(20, 5, 12, 0.88) 100%)",
          border: `1px solid ${borderColor}`,
          borderRadius: "1cqi",
          py: "1.2cqi",
          px: "0.8cqi",
          boxShadow: shadow,
          transition: "border 0.35s ease, box-shadow 0.35s ease",
          boxSizing: "border-box",
        }}
      >
        <Typography
          className="font-numbers"
          sx={{
            fontSize: "4.2cqi",
            fontWeight: 800,
            letterSpacing: "-0.01em",
            color: "#FFFFFF",
            fontVariantNumeric: "tabular-nums",
            lineHeight: 1,
            whiteSpace: "nowrap",
            textShadow: "0 2px 10px rgba(0, 0, 0, 0.85)",
          }}
        >
          {value || "Loading.."}
        </Typography>
      </Box>
    </Box>
  );
};

const MetalCard = ({
  title,
  subTitle,
  imageSrc,
  bidVal,
  askVal,
  bidDir,
  askDir,
  isSilver = false,
}) => {
  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "1.6cqi",
        background: isSilver
          ? "linear-gradient(180deg, rgba(38, 12, 22, 0.88) 0%, rgba(18, 5, 12, 0.95) 100%)"
          : "linear-gradient(180deg, rgba(48, 12, 25, 0.88) 0%, rgba(22, 5, 14, 0.95) 100%)",
        backdropFilter: "blur(20px)",
        border: isSilver
          ? "1px solid rgba(186, 200, 217, 0.3)"
          : "1px solid rgba(229, 197, 131, 0.35)",
        boxShadow:
          "0 1cqi 2.5cqi rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 237, 165, 0.2)",
        p: "3cqi",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        boxSizing: "border-box",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: "15%",
          right: "15%",
          height: "2px",
          background: isSilver
            ? "linear-gradient(90deg, transparent, rgba(186, 200, 217, 0.9), transparent)"
            : "linear-gradient(90deg, transparent, rgba(255, 237, 165, 0.9), transparent)",
        },
      }}
    >
      {/* Header Row: 3D Metal Icon + Title + Live Market Badge */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          pb: "0.9cqi",
          borderBottom: "1px solid rgba(229, 197, 131, 0.16)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            gap: "1.2cqi",
          }}
        >
          <Box
            component="img"
            src={imageSrc}
            alt={title}
            sx={{
              width: "5.5cqi",
              height: "5.5cqi",
              objectFit: "contain",
              filter: "drop-shadow(0 0.4cqi 0.8cqi rgba(0,0,0,0.6))",
              animation: "float 4s ease-in-out infinite",
            }}
          />
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography
              className="font-cinzel"
              sx={{
                fontSize: "3.2cqi",
                fontWeight: 800,
                letterSpacing: "0.08em",
                color: isSilver ? "#BAC8D9" : "#FFEDA5",
                lineHeight: 1,
                textTransform: "uppercase",
              }}
            >
              {title}
            </Typography>
            <Typography
              className="font-numbers"
              sx={{
                fontSize: "1.6cqi",
                fontWeight: 600,
                letterSpacing: "0.08em",
                color: "rgba(255, 255, 255, 0.6)",
                lineHeight: 1.2,
                mt: "0.2cqi",
              }}
            >
              {subTitle}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Middle BID & ASK Grid: Prominent side-by-side rates */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "1.4cqi",
          width: "100%",
          pt: "0.9cqi",
        }}
      >
        <RateBox label="BID" value={bidVal} dir={bidDir} isSilver={isSilver} />
        <RateBox label="ASK" value={askVal} dir={askDir} isSilver={isSilver} />
      </Box>
    </Box>
  );
};

const PortraitSpotRates = ({ children }) => {
  const { goldData, silverData } = useSpotRate();

  // Price direction tracking for pulse animation
  const [goldBidDir, setGoldBidDir] = useState("neutral");
  const [goldAskDir, setGoldAskDir] = useState("neutral");
  const [silverBidDir, setSilverBidDir] = useState("neutral");
  const [silverAskDir, setSilverAskDir] = useState("neutral");

  const prev = useRef({
    goldBid: null,
    goldAsk: null,
    silverBid: null,
    silverAsk: null,
  });

  const detectChange = (prevVal, currVal, setDir) => {
    if (prevVal === null) return currVal;
    const p = Number(prevVal);
    const c = Number(currVal);
    if (!isNaN(p) && !isNaN(c) && p > 0 && c > 0) {
      if (c > p) {
        setDir("rise");
        setTimeout(() => setDir("neutral"), 700);
      } else if (c < p) {
        setDir("fall");
        setTimeout(() => setDir("neutral"), 700);
      }
    }
    return currVal;
  };

  useEffect(() => {
    prev.current.goldBid = detectChange(
      prev.current.goldBid,
      goldData?.bid,
      setGoldBidDir,
    );
  }, [goldData?.bid]);

  useEffect(() => {
    prev.current.goldAsk = detectChange(
      prev.current.goldAsk,
      goldData?.ask,
      setGoldAskDir,
    );
  }, [goldData?.ask]);

  useEffect(() => {
    prev.current.silverBid = detectChange(
      prev.current.silverBid,
      silverData?.bid,
      setSilverBidDir,
    );
  }, [silverData?.bid]);

  useEffect(() => {
    prev.current.silverAsk = detectChange(
      prev.current.silverAsk,
      silverData?.ask,
      setSilverAskDir,
    );
  }, [silverData?.ask]);

  // Live Riyadh clock for bottom ticker
  const [currentTime, setCurrentTime] = useState("");
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
          timeZone: "Asia/Riyadh",
        }),
      );
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format Spot rates without dollar sign in the box (clean financial display)
  const goldBidFormatted = formatPrice(goldData?.bid, 2);
  const goldAskFormatted = formatPrice(goldData?.ask, 2);
  const silverBidFormatted = formatPrice(silverData?.bid, 3);
  const silverAskFormatted = formatPrice(silverData?.ask, 3);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: "1.6cqi",
      }}
    >
      {/* 1. TOP: GOLD & SILVER SPOT (BID & ASK) */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.6cqi",
          width: "100%",
          flex: "0 0 auto",
        }}
      >
        <MetalCard
          title="Gold"
          subTitle="SPOT (OZ)"
          imageSrc="/images/gold-bar.png"
          bidVal={goldBidFormatted}
          askVal={goldAskFormatted}
          bidDir={goldBidDir}
          askDir={goldAskDir}
          isSilver={false}
        />

        <MetalCard
          title="Silver"
          subTitle="SPOT (OZ)"
          imageSrc="/images/silver-bar.png"
          bidVal={silverBidFormatted}
          askVal={silverAskFormatted}
          bidDir={silverBidDir}
          askDir={silverAskDir}
          isSilver={true}
        />
      </Box>

      {/* 2. MIDDLE: KARAT CARDS (Rendered between Spot Rates and Bottom Bar) */}
      {children && (
        <Box
          sx={{
            flex: "1 1 auto",
            minHeight: 0,
            width: "100%",
            display: "flex",
          }}
        >
          {children}
        </Box>
      )}

      {/* 3. BOTTOM: OUNCE TICKER / STATUS BAR */}
      <Box
        sx={{
          flex: "0 0 auto",
          borderRadius: "1.2cqi",
          background:
            "linear-gradient(90deg, rgba(38, 10, 20, 0.94) 0%, rgba(55, 14, 28, 0.96) 50%, rgba(38, 10, 20, 0.94) 100%)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(229, 197, 131, 0.28)",
          boxShadow: "0 0.8cqi 2cqi rgba(0, 0, 0, 0.55)",
          mt: "11cqi",
          py: "1.1cqi",
          px: "2cqi",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Left: Au Gold PRICE PER OUNCE */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "1.2cqi" }}>
          <Box
            sx={{
              width: "4.2cqi",
              height: "4.2cqi",
              borderRadius: "0.8cqi",
              background: "linear-gradient(135deg, #FFEDA5 0%, #D4AF37 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#1c040f",
              fontWeight: 900,
              fontSize: "2.1cqi",
              boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
            }}
          >
            Au
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography
              className="font-cinzel"
              sx={{
                fontSize: "2.2cqi",
                fontWeight: 800,
                color: "#FFEDA5",
                lineHeight: 1.15,
                letterSpacing: "0.06em",
              }}
            >
              GOLD PRICE PER OUNCE
            </Typography>
            <Typography
              className="font-numbers"
              sx={{
                fontSize: "1.8cqi",
                fontWeight: 600,
                color: "rgba(255, 255, 255, 0.75)",
                lineHeight: 1.2,
                letterSpacing: "0.04em",
                mt: "0.2cqi",
              }}
            >
              {goldBidFormatted
                ? `1 OZ = $${goldBidFormatted} USD`
                : "Streaming live market data..."}
            </Typography>
          </Box>
        </Box>

        {/* Right: Live Market Indicator + Riyadh Time */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "1.6cqi" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: "0.6cqi" }}>
            <Box
              sx={{
                width: "1cqi",
                height: "1cqi",
                borderRadius: "50%",
                bgcolor: "#3DDC84",
                boxShadow: "0 0 0.8cqi #3DDC84",
                animation: "pulse 1.5s infinite",
              }}
            />
            <Typography
              className="font-numbers"
              sx={{
                fontSize: "1.9cqi",
                fontWeight: 800,
                color: "#3DDC84",
                letterSpacing: "0.06em",
              }}
            >
              LIVE
            </Typography>
          </Box>

          <Typography
            className="font-numbers"
            sx={{
              fontSize: "2.1cqi",
              fontWeight: 700,
              color: "rgba(255, 237, 165, 0.95)",
              letterSpacing: "0.04em",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {currentTime ? `${currentTime} (KSA)` : "RIYADH"}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default PortraitSpotRates;
