import React, { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useSpotRate } from "../context/SpotRateContext";

const SpotRate = () => {
  const { goldData, silverData } = useSpotRate();

  const [goldBidDir, setGoldBidDir] = useState("neutral");
  const [goldAskDir, setGoldAskDir] = useState("neutral");
  const [silverBidDir, setSilverBidDir] = useState("neutral");
  const [silverAskDir, setSilverAskDir] = useState("neutral");

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkWidth = () => {
      setIsMobile(window.screen.width <= 768); // 🔥 screen.width ignores zoom
    };

    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  const prev = useRef({
    goldBid: null,
    goldAsk: null,
    silverBid: null,
    silverAsk: null,
    platinumBid: null,
    platinumAsk: null,
  });

  const detectChange = (prevVal, currVal, setDir) => {
    if (prevVal === null) return currVal;

    if (currVal > prevVal) {
      setDir("rise");
      setTimeout(() => setDir("neutral"), 800);
    } else if (currVal < prevVal) {
      setDir("fall");
      setTimeout(() => setDir("neutral"), 800);
    }

    return currVal;
  };

  useEffect(() => {
    prev.current.goldBid = detectChange(
      prev.current.goldBid,
      goldData.bid,
      setGoldBidDir,
    );
  }, [goldData.bid]);

  useEffect(() => {
    prev.current.goldAsk = detectChange(
      prev.current.goldAsk,
      goldData.ask,
      setGoldAskDir,
    );
  }, [goldData.ask]);

  useEffect(() => {
    prev.current.silverBid = detectChange(
      prev.current.silverBid,
      silverData.bid,
      setSilverBidDir,
    );
  }, [silverData.bid]);

  useEffect(() => {
    prev.current.silverAsk = detectChange(
      prev.current.silverAsk,
      silverData.ask,
      setSilverAskDir,
    );
  }, [silverData.ask]);

  const RateBox = ({
    label,
    value,
    dir,
    isSilver,
    lowHighLabel,
    lowHighValue,
  }) => {
    const hasPulse = dir !== "neutral";

    // Dynamic styles based on direction
    let bgColor = "rgba(28, 4, 15, 0.65)";
    let border = isSilver
      ? "1px solid rgba(255, 255, 255, 0.15)"
      : "1px solid rgba(229, 197, 131, 0.25)";
    let color = "#FFFFFF";

    if (dir === "rise") {
      bgColor = "#2E8B57";
      border = "1px solid #3DDC84";
      color = "#ffffff";
    } else if (dir === "fall") {
      bgColor = "#8B1E2B";
      border = "1px solid #FF4D4D";
      color = "#ffffff";
    }

    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "14px", md: "1.3vw" },
            fontWeight: 700,
            color: isSilver ? "#BAC8D9" : "#FFEDA5",
            letterSpacing: "0.08em",
            mb: "0.2vw",
          }}
        >
          {label}
        </Typography>

        <Box
          sx={{
            width: "100%",
            textAlign: "center",
            bgcolor: bgColor,
            border: border,
            borderRadius: "0.8vw",
            py: "0.5vw",
            px: "1vw",
            boxShadow: "inset 0 2px 8px rgba(0, 0, 0, 0.4)",
            transition: "all 0.4s ease",
            ...(hasPulse && {
              animation:
                dir === "rise"
                  ? "pulseRise 0.8s ease-out"
                  : "pulseFall 0.8s ease-out",
            }),
          }}
        >
          <Typography
            sx={{
              fontSize: {
                xs: "22px",
                md: "3.4vw",
              },
              fontWeight: 800,
              letterSpacing: "0.02em",
              color: color,
              fontVariantNumeric: "tabular-nums",
              lineHeight: 1.1,
            }}
          >
            {value || "--"}
          </Typography>
        </Box>

        <Typography
          sx={{
            fontSize: { xs: "12px", md: "1.3vw" },
            fontWeight: 600,
            color: "#EAEFF5",
            mt: "0.4vw",
            letterSpacing: "0.02em",
          }}
        >
          {lowHighLabel}{" "}
          <span
            style={{
              color: lowHighLabel === "LOW" ? "#3DDC84" : "#FF4D4D",
              fontWeight: 700,
              marginLeft: "0.2vw",
            }}
          >
            {lowHighValue || "--"}
          </span>
        </Typography>
      </Box>
    );
  };

  const MetalPanel = ({ data, bidDir, askDir, theme }) => {
    const isSilver = theme === "silver";

    let title = "GOLD";
    let panelBg =
      "linear-gradient(135deg, rgba(65, 14, 32, 0.65) 0%, rgba(28, 4, 15, 0.78) 100%)";
    let imageSrc = "/images/gold-bar.png";

    if (theme === "silver") {
      title = "SILVER";
      imageSrc = "/images/silver-bar.png";
      panelBg =
        "linear-gradient(135deg, rgba(58, 14, 30, 0.65) 0%, rgba(25, 4, 15, 0.78) 100%)";
    }

    return (
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: "1.8vw",
          backdropFilter: "blur(0.8vw)",
          background: panelBg,
          boxShadow:
            "0 0.8vw 2.5vw rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 237, 165, 0.15)",
          padding: {
            xs: "4vw 5vw",
            md: "1.1vw 1.8vw",
          },
          display: "grid",
          alignItems: "center",
          gap: " 0.8vw",
          gridTemplateColumns: "1fr 1fr 1fr",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            padding: "1px", // border thickness
            borderRadius: "inherit",
            background: isSilver
              ? `
                linear-gradient(
                  135deg,
                  rgba(255, 255, 255, 0.4) 0%,
                  rgba(186, 200, 217, 0.15) 50%,
                  rgba(255, 255, 255, 0.3) 100%
                )
              `
              : `
                linear-gradient(
                  135deg,
                  rgba(255, 237, 165, 0.5) 0%,
                  rgba(200, 160, 80, 0.15) 50%,
                  rgba(255, 237, 165, 0.4) 100%
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
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: "0.5vw",
            width: "100%",
          }}
        >
          <Box
            className="animate-float"
            sx={{
              width: { xs: "36px", sm: "48px", md: "4vw" },
              height: { xs: "36px", sm: "48px", md: "4vw" },
              objectFit: "contain",
              filter: "drop-shadow(0 0.4vw 0.8vw rgba(0,0,0,0.4))",
            }}
            component="img"
            src={imageSrc}
            alt={title}
          />

          <Box
            sx={{
              fontSize: { xs: "16px", md: "2vw" },
              fontWeight: 700,
              letterSpacing: "0.1em",
              color: isSilver ? "#BAC8D9" : "#E5C583",
              lineHeight: "1",
            }}
          >
            {title}
          </Box>
        </Box>

        {/* BID Box */}
        <RateBox
          label="BID"
          value={data.bid}
          dir={bidDir}
          isSilver={isSilver}
          lowHighLabel="LOW"
          lowHighValue={data.low}
        />

        {/* ASK Box */}
        <RateBox
          label="ASK"
          value={data.ask}
          dir={askDir}
          isSilver={isSilver}
          lowHighLabel="HIGH"
          lowHighValue={data.high}
        />
      </Box>
    );
  };

  return (
    <Box
      sx={{
        display: "grid",
        gap: "1.1vw",
        width: "100%",
        alignItems: "end",
        marginTop: {
          xs: "20px", // mobile
          sm: "0vw", // small tablets
        },
        gridTemplateColumns: { xs: "1fr" },
      }}
    >
      <MetalPanel
        data={goldData}
        bidDir={goldBidDir}
        askDir={goldAskDir}
        theme="gold"
      />

      <MetalPanel
        data={silverData}
        bidDir={silverBidDir}
        askDir={silverAskDir}
        theme="silver"
      />
    </Box>
  );
};

export default SpotRate;
