import { useState, useEffect } from "react";
import { SpotRateProvider } from "./context/SpotRateContext";
import { MarketDataProvider } from "./context/MarketDataContext";
import "./App.css";
import TvScreen from "./pages/tvscreenView";
import ErrorPage from "./components/ErrorPage";
import { Route, Routes } from "react-router-dom";

function App() {
  const [isTvScreen, setIsTvScreen] = useState(window.screen.width >= 100);

  useEffect(() => {
    const handleResize = () => {
      setIsTvScreen(window.screen.width >= 100);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <SpotRateProvider>
      <MarketDataProvider>
        {!isTvScreen ? (
          <ErrorPage />
        ) : (
          <Routes>
            <Route path="/" element={<TvScreen />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        )}
      </MarketDataProvider>
    </SpotRateProvider>
  );
}

export default App;
