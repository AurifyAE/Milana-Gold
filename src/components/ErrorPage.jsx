import React, { useEffect, useState } from "react";

// Easily configure the logo path for future projects here:
const LOGO_SRC = "/images/logo.svg";
const LOGO_ALT = "Logo";

const ErrorPage = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <style>{`
        .ep-root {
          min-height: 100dvh;
          background: #0A0A0C; /* Deep black-charcoal dark background */
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
          position: relative;
          padding: 40px 24px;
        }

        /* Viewfinder corner brackets */
        .ep-corner {
          position: absolute;
          width: 16px;
          height: 16px;
          border-color: rgba(255, 255, 255, 0.12);
          border-style: solid;
          pointer-events: none;
          z-index: 5;
        }
        .ep-corner--tl { top: 32px; left: 32px; border-width: 1px 0 0 1px; }
        .ep-corner--tr { top: 32px; right: 32px; border-width: 1px 1px 0 0; }
        .ep-corner--bl { bottom: 32px; left: 32px; border-width: 0 0 1px 1px; }
        .ep-corner--br { bottom: 32px; right: 32px; border-width: 0 1px 1px 0; }

        /* Ambient monochrome light blobs */
        .ep-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          pointer-events: none;
          opacity: 0;
          transition: opacity 1.5s ease;
        }
        .ep-blob--1 {
          width: 520px; height: 420px;
          top: -120px; left: -100px;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.03) 0%, transparent 70%);
        }
        .ep-blob--2 {
          width: 400px; height: 380px;
          bottom: -80px; right: -60px;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.02) 0%, transparent 70%);
        }
        .ep-blob--3 {
          width: 260px; height: 260px;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(255, 255, 255, 0.02) 0%, transparent 70%);
        }
        .ep-mounted .ep-blob { opacity: 1; }

        /* Fine dot grid (white dots on dark) */
        .ep-grid {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          background-size: 36px 36px;
          pointer-events: none;
        }

        /* Animated ring decorations */
        .ep-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.02);
          pointer-events: none;
          animation: ep-spin 30s linear infinite;
        }
        .ep-ring--1 { width: 600px; height: 600px; border-color: rgba(255, 255, 255, 0.015); animation-duration: 40s; }
        .ep-ring--2 { width: 800px; height: 800px; border-color: rgba(255, 255, 255, 0.01); animation-duration: 60s; animation-direction: reverse; }
        @keyframes ep-spin { to { transform: rotate(360deg); } }

        /* Card container (Glassmorphic Dark Card) */
        .ep-card {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 32px;
          max-width: 560px;
          width: 100%;
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s;
          background: rgba(18, 18, 20, 0.75);
          box-shadow: 0 16px 48px rgba(0, 0, 0, 0.45);
          padding: 56px 48px 48px 48px;
          border-radius: 24px;
          backdrop-filter: blur(20px);
        }
        .ep-card::before {
          content: "";
          position: absolute;
          inset: 0;
          padding: 1px;
          border-radius: 24px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.02) 50%, rgba(255, 255, 255, 0.12) 100%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }
        .ep-mounted .ep-card {
          opacity: 1;
          transform: translateY(0);
        }

        /* Mockup browser controls */
        .ep-card-controls {
          position: absolute;
          top: 20px;
          left: 24px;
          display: flex;
          gap: 6px;
        }
        .ep-control-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.12);
        }

        /* Icon illustration area */
        .ep-icon-wrap {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Ping animation for the icon glow */
        .ep-icon-glow {
          position: absolute;
          inset: -20px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.03) 0%, transparent 70%);
          animation: ep-pulse 3s ease-in-out infinite;
        }
        @keyframes ep-pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 0.4; }
        }

        /* Logo styling (Inverts to white to display clean templates) */
        .ep-logo {
          display: block;
          height: 48px;
          width: auto;
          opacity: 0.9;
          margin-bottom: 4px;
          object-fit: contain;
          filter: brightness(0) invert(1);
        }

        /* Divider */
        .ep-divider {
          width: 1px;
          height: 48px;
          background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.08), transparent);
        }

        /* Text content */
        .ep-content {
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .ep-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #1c1c1e;
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #E5E5EA;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 5px 12px;
          border-radius: 100px;
          margin: 0 auto;
        }
        .ep-badge-dot {
          width: 6px;
          height: 6px;
          background: #ffffff;
          border-radius: 50%;
          animation: ep-blink 2s ease-in-out infinite;
        }
        @keyframes ep-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .ep-heading {
          font-family: 'Syne', sans-serif;
          font-size: clamp(26px, 5vw, 42px);
          font-weight: 800;
          line-height: 1.1;
          color: #ffffff;
          letter-spacing: -0.02em;
        }

        .ep-sub {
          font-size: 15px;
          font-weight: 300;
          color: #a1a1a6;
          line-height: 1.65;
          max-width: 400px;
          margin: 0 auto;
        }

        /* Device icons row */
        .ep-devices {
          display: flex;
          gap: 20px;
          align-items: flex-end;
          justify-content: center;
          margin-top: 4px;
        }

        .ep-device {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          opacity: 0.8;
        }
        .ep-device-label {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #8E8E93;
        }

        /* Action row */
        .ep-actions {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .ep-hint {
          font-size: 13px;
          color: #636366;
        }

        /* Premium interactive back button */
        .ep-button {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.18);
          color: #ffffff;
          padding: 10px 24px;
          border-radius: 100px;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          margin-top: 4px;
          font-family: inherit;
        }
        .ep-button:hover {
          background: #ffffff;
          color: #000000;
          border-color: #ffffff;
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
        }

        /* Bottom fade line */
        .ep-line {
          width: 160px;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.1), transparent);
          margin-top: 8px;
        }
      `}</style>

      <div className={`ep-root${mounted ? " ep-mounted" : ""}`}>
        {/* Decorative corner viewfinders */}
        <div className="ep-corner ep-corner--tl" />
        <div className="ep-corner ep-corner--tr" />
        <div className="ep-corner ep-corner--bl" />
        <div className="ep-corner ep-corner--br" />

        {/* Background layers */}
        <div className="ep-grid" />
        <div className="ep-blob ep-blob--1" />
        <div className="ep-blob ep-blob--2" />
        <div className="ep-blob ep-blob--3" />
        <div className="ep-ring ep-ring--1" style={{ position: "absolute" }} />
        <div className="ep-ring ep-ring--2" style={{ position: "absolute" }} />

        <div className="ep-card">
          {/* Status bar mockup dots */}
          <div className="ep-card-controls">
            <span className="ep-control-dot" />
            <span className="ep-control-dot" />
            <span className="ep-control-dot" />
          </div>

          {/* Logo configured from variables at top */}
          <img src={LOGO_SRC} alt={LOGO_ALT} className="ep-logo" />

          {/* Devices illustration */}
          <div className="ep-icon-wrap">
            <div className="ep-icon-glow" />
            <DevicesIllustration />
          </div>

          {/* Content */}
          <div className="ep-content">
            <div className="ep-badge">
              <span className="ep-badge-dot" />
              Access Restricted
            </div>

            <h1 className="ep-heading">
              Available on Desktop <br />& TV only
            </h1>

            <p className="ep-sub">
              This experience is optimised for larger screens. Please switch to
              a desktop computer or TV to continue.
            </p>
          </div>

          {/* Device labels */}
          <div className="ep-devices">
            <div className="ep-device">
              <svg width="64" height="44" viewBox="0 0 64 44" fill="none">
                <rect
                  x="1"
                  y="1"
                  width="62"
                  height="38"
                  rx="4"
                  stroke="#8e8e93"
                  strokeWidth="1.5"
                  fill="#1c1c1e"
                />
                <rect
                  x="8"
                  y="8"
                  width="48"
                  height="26"
                  rx="2"
                  fill="#2c2c2e"
                />
                <rect x="22" y="39" width="20" height="4" fill="#3a3a3c" />
                <rect
                  x="16"
                  y="43"
                  width="32"
                  height="1"
                  rx="0.5"
                  fill="#48484a"
                />
              </svg>
              <span className="ep-device-label">Desktop</span>
            </div>

            <div
              style={{
                width: 1,
                height: 48,
                background: "rgba(255, 255, 255, 0.08)",
                alignSelf: "center",
              }}
            />

            <div className="ep-device">
              <svg width="80" height="56" viewBox="0 0 80 56" fill="none">
                <rect
                  x="1"
                  y="1"
                  width="78"
                  height="46"
                  rx="4"
                  stroke="#8e8e93"
                  strokeWidth="1.5"
                  fill="#1c1c1e"
                />
                <rect
                  x="6"
                  y="6"
                  width="68"
                  height="36"
                  rx="2"
                  fill="#2c2c2e"
                />
                <rect x="30" y="47" width="20" height="4" fill="#3a3a3c" />
                <rect
                  x="24"
                  y="51"
                  width="32"
                  height="4"
                  rx="2"
                  fill="#48484a"
                />
              </svg>
              <span className="ep-device-label">TV</span>
            </div>
          </div>

          <div className="ep-actions">
            <span className="ep-hint">Detected: Mobile / Tablet</span>
            <button className="ep-button" onClick={() => window.history.back()}>
              Return to Previous Page
            </button>
            <div className="ep-line" />
          </div>
        </div>
      </div>
    </>
  );
};

function DevicesIllustration() {
  return (
    <svg
      width="220"
      height="140"
      viewBox="0 0 220 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Glow effect behind screens */}
      <ellipse cx="110" cy="95" rx="90" ry="28" fill="#ffffff" opacity="0.04" />

      {/* Monitor */}
      <rect
        x="34"
        y="10"
        width="152"
        height="96"
        rx="8"
        fill="#1c1c1e"
        stroke="#3a3a3c"
        strokeWidth="1.5"
      />
      <rect x="42" y="18" width="136" height="80" rx="4" fill="#2c2c2e" />

      {/* Screen content lines */}
      <rect
        x="54"
        y="30"
        width="80"
        height="6"
        rx="3"
        fill="#3a3a3c"
        opacity="0.8"
      />
      <rect
        x="54"
        y="44"
        width="56"
        height="4"
        rx="2"
        fill="#2c2c2e"
        opacity="0.6"
      />
      <rect
        x="54"
        y="54"
        width="96"
        height="4"
        rx="2"
        fill="#2c2c2e"
        opacity="0.4"
      />
      <rect
        x="54"
        y="64"
        width="72"
        height="4"
        rx="2"
        fill="#2c2c2e"
        opacity="0.35"
      />
      <rect
        x="54"
        y="74"
        width="40"
        height="4"
        rx="2"
        fill="#2c2c2e"
        opacity="0.25"
      />

      {/* Screen glow dot */}
      <circle cx="150" cy="50" r="18" fill="#3a3a3c" opacity="0.4" />
      <circle cx="150" cy="50" r="10" fill="#48484a" opacity="0.5" />

      {/* Stand */}
      <rect x="98" y="106" width="24" height="14" rx="2" fill="#2c2c2e" />
      <rect x="84" y="120" width="52" height="6" rx="3" fill="#3a3a3c" />

      {/* Crossed-out phone (subtle overlay) */}
      <rect
        x="172"
        y="70"
        width="32"
        height="50"
        rx="4"
        fill="#1c1c1e"
        stroke="#3a3a3c"
        strokeWidth="1"
        opacity="0.7"
      />
      <line
        x1="168"
        y1="66"
        x2="208"
        y2="124"
        stroke="#8e8e93"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.7"
      />
      <line
        x1="208"
        y1="66"
        x2="168"
        y2="124"
        stroke="#8e8e93"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}

export default ErrorPage;
