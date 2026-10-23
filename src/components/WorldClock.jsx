import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

const clockConfig = [
  {
    key: "saudi",
    label: "SAUDI",
    timeZone: "Asia/Riyadh",
    flag: "/images/ksa.png",
  },

  {
    key: "london",
    label: "LONDON",
    timeZone: "Europe/London",
    flag: "/images/uk.png",
  },
  {
    key: "usa",
    label: "USA",
    timeZone: "America/New_York",
    flag: "/images/usa.png",
  },
];

const WorldClockHorizontal = () => {
  const [times, setTimes] = useState({});

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      const timeOptions = {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      };

      const updatedTimes = {};

      clockConfig.forEach((clock) => {
        updatedTimes[clock.key] = now.toLocaleTimeString("en-US", {
          ...timeOptions,
          timeZone: clock.timeZone,
        });
      });

      setTimes(updatedTimes);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        gap: "1vw",
        width: "100%",
      }}
    >
      {clockConfig.map((clock) => (
        <Box
          key={clock.key}
          sx={{
            display: "flex",
            alignItems: "center",
            // width: "100%",
            gap: {
              xs: "10px",
              lg: "0.8vw",
            },
            padding: "0.4vw 1.2vw",
            borderRadius: "0.8vw",
            background:
              "linear-gradient(135deg, rgba(65, 14, 32, 0.6) 0%, rgba(28, 4, 15, 0.72) 100%)",
            border: "1px solid rgba(229, 197, 131, 0.25)",
            boxShadow:
              "0 0.4vw 1.2vw rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 237, 165, 0.12)",
            backdropFilter: "blur(0.6vw)",
          }}
        >
          <Box
            sx={{
              width: {
                xs: "30px",
                lg: "3vw",
              },
              display: "flex",
              alignItems: "center",
            }}
          >
            <img
              src={clock.flag}
              alt={clock.label}
              style={{ width: "100%", height: "auto", borderRadius: "2px" }}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "start",
              flexDirection: "column",
            }}
          >
            <Typography
              sx={{
                fontSize: {
                  xs: "14px",
                  lg: "1vw",
                },
                fontWeight: 700,
                color: "#FFEDA5", // Luxury Gold
                letterSpacing: "0.08vw",
              }}
            >
              {clock.label}
            </Typography>

            <Typography
              sx={{
                fontSize: {
                  xs: "14px",
                  lg: "1.2vw",
                },
                color: "#FFFFFF",
                fontWeight: 700,
                letterSpacing: "0.03vw",
              }}
            >
              {times[clock.key] || "--:--"}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default WorldClockHorizontal;
