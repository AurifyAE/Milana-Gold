import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import {
  fetchSpotRates,
  fetchServerURL,
  fetchTVScreenData,
} from "../api/api";
import io from "socket.io-client";
import { useSpotRate } from "../context/SpotRateContext";
import mainLogo from "/images/logo.png";
import KaratCards from "../components/KaratCards";
import PortraitSpotRates from "../components/PortraitSpotRates";

function TvScreen() {
  const [serverURL, setServerURL] = useState(
    "https://capital-server-gnsu.onrender.com",
  );
  const [marketData, setMarketData] = useState({});
  const [commodities, setCommodities] = useState([]);
  const [goldBidSpread, setGoldBidSpread] = useState(0);
  const [goldAskSpread, setGoldAskSpread] = useState(0);
  const [silverBidSpread, setSilverBidSpread] = useState(0);
  const [silverAskSpread, setSilverAskSpread] = useState(0);

  const { updateMarketData } = useSpotRate();
  const adminId = import.meta.env.VITE_APP_ADMIN_ID;

  // Sync spot rates with context whenever marketData or spreads update
  useEffect(() => {
    updateMarketData(
      marketData,
      goldBidSpread,
      goldAskSpread,
      silverBidSpread,
      silverAskSpread,
    );
  }, [
    updateMarketData,
    marketData,
    goldBidSpread,
    goldAskSpread,
    silverBidSpread,
    silverAskSpread,
  ]);

  // Initial Data Fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [spotRatesRes, serverURLRes] = await Promise.all([
          fetchSpotRates(adminId),
          fetchServerURL(),
        ]);

        if (spotRatesRes?.data?.info) {
          const {
            commodities: comms,
            goldBidSpread: gBid,
            goldAskSpread: gAsk,
            silverBidSpread: sBid,
            silverAskSpread: sAsk,
          } = spotRatesRes.data.info;
          setCommodities(comms || []);
          setGoldBidSpread(gBid || 0);
          setGoldAskSpread(gAsk || 0);
          setSilverBidSpread(sBid || 0);
          setSilverAskSpread(sAsk || 0);
        }

        if (serverURLRes?.data?.info?.serverURL) {
          setServerURL(serverURLRes.data.info.serverURL);
        }
      } catch (err) {
        console.error("Error fetching initial data:", err);
      }
    };

    fetchData();

    // Verify TV screen permissions
    fetchTVScreenData(adminId).catch((err) => {
      console.warn("TV screen status:", err?.message);
    });
  }, [adminId]);

  // Real-time Socket Connection
  useEffect(() => {
    // On localhost, route through Vite proxy to satisfy server origin whitelist
    const isLocal =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";
    const socketUrl = isLocal ? "/" : serverURL;

    if (!socketUrl) return;

    const socket = io(socketUrl, {
      query: {
        secret: import.meta.env.VITE_APP_SOCKET_SECRET_KEY || "aurify@123",
      },
      transports: ["websocket", "polling"],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("Socket connected to:", socketUrl);
      socket.emit("request-data", ["GOLD", "SILVER"]);
    });

    socket.on("market-data", (data) => {
      if (Array.isArray(data)) {
        setMarketData((prev) => {
          const next = { ...prev };
          data.forEach((item) => {
            if (item?.symbol) {
              next[item.symbol] = { ...next[item.symbol], ...item };
            }
          });
          return next;
        });
      } else if (data && (data.symbol || data.epic)) {
        const sym = data.symbol || data.epic;
        const normalizedKey =
          sym.toLowerCase() === "gold"
            ? "Gold"
            : sym.toLowerCase() === "silver"
              ? "Silver"
              : sym;

        setMarketData((prev) => ({
          ...prev,
          [normalizedKey]: {
            ...prev[normalizedKey],
            ...data,
          },
        }));
      }
    });

    socket.on("error", (err) => {
      console.error("WebSocket error:", err);
    });

    return () => {
      socket.disconnect();
    };
  }, [serverURL]);

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100dvh",
        maxHeight: "100dvh",
        backgroundColor: "#140b10",
        color: "white",
        overflow: "hidden",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Background Ambience Layer */}
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          overflow: "hidden",
          zIndex: 0,
        }}
      >
        <Box
          component="img"
          src="/images/background.png"
          alt="luxury background"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.95,
          }}
        />
        {/* Subtle radial dark overlay for depth */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at center 20%, rgba(20, 11, 16, 0.2) 0%, rgba(10, 4, 8, 0.72) 100%)",
          }}
        />
      </Box>

      {/* Screen Container strictly matching 1080x1920 (9:16) Portrait TV Resolution */}
      <Box
        sx={{
          containerType: "inline-size",
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: "calc(100dvh * (1080 / 1920))",
          aspectRatio: "1080 / 1920",
          height: "100dvh",
          maxHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          px: "3.2cqi",
          py: "2.4cqi",
          boxSizing: "border-box",
        }}
      >
        {/* TOP 1/4 PORTION: LOGO WITH ORNAMENTAL ACCENT (~21% height) */}
        <Box
          sx={{
            height: "21%",
            minHeight: "21%",
            maxHeight: "21%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            width: "100%",
          }}
        >
          {/* Subtle warm halo behind logo */}
          <Box
            sx={{
              position: "absolute",
              width: "65%",
              height: "75%",
              background:
                "radial-gradient(ellipse at center, rgba(255, 237, 165, 0.16) 0%, rgba(200, 160, 80, 0.04) 50%, transparent 70%)",
              filter: "blur(28px)",
              pointerEvents: "none",
            }}
          />

          {/* Centered Milana Gold Logo */}
          <Box
            component="img"
            src={mainLogo}
            alt="Milana Gold & Diamonds"
            sx={{
              maxHeight: "82%",
              maxWidth: "88%",
              width: "auto",
              height: "auto",
              objectFit: "contain",
              filter: "drop-shadow(0 0.5cqi 1.8cqi rgba(229, 197, 131, 0.45))",
              animation: "goldAura 5s ease-in-out infinite",
              userSelect: "none",
            }}
          />

          {/* Ornamental Divider Line */}
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              width: "80%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "1.5cqi",
            }}
          >
            <Box
              sx={{
                flex: 1,
                height: "1px",
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(229, 197, 131, 0.4) 100%)",
              }}
            />
            <Typography
              sx={{
                color: "#FFEDA5",
                fontSize: "1.8cqi",
                lineHeight: 1,
                opacity: 0.8,
              }}
            >
              ✦
            </Typography>
            <Box
              sx={{
                flex: 1,
                height: "1px",
                background:
                  "linear-gradient(90deg, rgba(229, 197, 131, 0.4) 0%, transparent 100%)",
              }}
            />
          </Box>
        </Box>

        {/* BOTTOM PORTION: LIVE RATES (Spot BID/ASK at Top + Karat Cards in Middle + Ounce Bar at Bottom) */}
        <Box
          sx={{
            height: "75%",
            maxHeight: "75%",
            display: "flex",
            flexDirection: "column",
            width: "100%",
            pt: "1cqi",
            pb: "0.2cqi",
            boxSizing: "border-box",
          }}
        >
          <PortraitSpotRates>
            <KaratCards commodities={commodities} />
          </PortraitSpotRates>
        </Box>
      </Box>
    </Box>
  );
}

export default TvScreen;
