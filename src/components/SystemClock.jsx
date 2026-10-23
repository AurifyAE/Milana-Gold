import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

const SystemClock = () => {
  const [timeData, setTimeData] = useState({
    day: "",
    date: "",
    time: "",
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const DAYS = [
        "SUNDAY",
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
      ];

      const dayStr = DAYS[now.getDay()];
      const MONTHS = [
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC",
      ];

      const dateStr = `${String(now.getDate()).padStart(2, "0")} ${
        MONTHS[now.getMonth()]
      } ${now.getFullYear()}`;

      const timeStr = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      setTimeData({
        day: dayStr,
        date: dateStr,
        time: timeStr,
      });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Glass Container */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "1vw",
          width: "100%",
          padding: "0vw 2.5vw",
          borderRadius: "20px",
        }}
      >
        {/* Date */}
        <Typography
          sx={{
            fontSize: {
              xs: "12px",
              sm: "2vw",
            },
            fontWeight: 600,
            letterSpacing: "2px",
            color: "#FFEDA5", // Champagne Gold
            textShadow: "0 2px 12px rgba(0, 0, 0, 0.6)",
            lineHeight: "1",
          }}
        >
          {timeData.date || "-- --- ----"}
        </Typography>
        {/* Day */}
        <Typography
          sx={{
            fontSize: {
              xs: "12px",
              sm: "1vw",
            },
            color: "#EAEFF5", // Platinum Silver
            letterSpacing: "2px",
            fontWeight: 500,
            lineHeight: "1",
            textShadow: "0 2px 8px rgba(0, 0, 0, 0.5)",
          }}
        >
          {timeData.day || "-----"}
        </Typography>
      </Box>
    </Box>
  );
};

export default SystemClock;
