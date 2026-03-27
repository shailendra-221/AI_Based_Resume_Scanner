import React, { useState } from 'react';
import './Header.css';

// SET YOUR TELEGRAM BOT USERNAME HERE (without @ symbol)
// e.g. if your bot is @myresume_bot → put: myresume_bot
const TELEGRAM_BOT_USERNAME = import.meta.env.VITE_TELEGRAM_BOT_USERNAME || '';

export default function Header() {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleTryBot = () => {
    if (TELEGRAM_BOT_USERNAME) {
      window.open(`https://t.me/${TELEGRAM_BOT_USERNAME}`, '_blank');
    } else {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 3500);
    }
  };

  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo">
          <div className="logo-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M9 12h6M9 16h6M9 8h4M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              <circle cx="19" cy="19" r="5" fill="var(--accent)" stroke="var(--bg-primary)" strokeWidth="1.5"/>
              <path d="M17 19l1.5 1.5L21 17" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="logo-text">ResumeAI</span>
          <span className="logo-badge">BETA</span>
        </div>
        <nav className="nav">
          <a href="#scan" className="nav-link">Scan</a>
          <a href="#telegram" className="nav-link">Telegram Bot</a>
          <div className="nav-btn-wrapper">
            <button onClick={handleTryBot} className="nav-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.052 13.46l-2.953-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.953z"/>
              </svg>
              Try Bot
            </button>
            {showTooltip && (
              <div className="bot-tooltip">
                ⚙️ Add <code>VITE_TELEGRAM_BOT_USERNAME=your_bot</code> in <code>client/.env</code>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
