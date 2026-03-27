import React from 'react';
import './TelegramInfo.css';

const TELEGRAM_BOT_USERNAME = import.meta.env.VITE_TELEGRAM_BOT_USERNAME || '';

export default function TelegramInfo() {
  const steps = [
    { icon: '🔍', title: 'Start the Bot', desc: `Search @${TELEGRAM_BOT_USERNAME || 'YourResumeBot'} on Telegram and type /scan` },
    { icon: '📋', title: 'Send Job Description', desc: 'Paste text or send a PDF of the job description' },
    { icon: '📄', title: 'Upload Your Resume', desc: 'Send your resume as a PDF file to the bot' },
    { icon: '🎯', title: 'Get Results', desc: 'Receive score, analysis, and optimized resume PDF instantly' },
  ];

  const openBot = () => {
    if (TELEGRAM_BOT_USERNAME) {
      window.open(`https://t.me/${TELEGRAM_BOT_USERNAME}`, '_blank');
    } else {
      alert('Set VITE_TELEGRAM_BOT_USERNAME in client/.env first!\n\nExample:\nVITE_TELEGRAM_BOT_USERNAME=myresume_bot');
    }
  };

  return (
    <section className="telegram-section" id="telegram">
      <div className="telegram-inner">
        <div className="telegram-header">
          <div className="telegram-logo">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.052 13.46l-2.953-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.953z"/>
            </svg>
          </div>
          <div className="telegram-header-text">
            <h2 className="telegram-title">Use the Telegram Bot</h2>
            <p className="telegram-subtitle">
              Scan your resume directly from Telegram — no browser needed
            </p>
          </div>
          <button className="open-bot-btn" onClick={openBot}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.052 13.46l-2.953-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.953z"/>
            </svg>
            {TELEGRAM_BOT_USERNAME ? `Open @${TELEGRAM_BOT_USERNAME}` : 'Open Bot'}
          </button>
        </div>

        <div className="steps-grid">
          {steps.map((step, i) => (
            <div className="step-card" key={i} style={{ animationDelay: `${i * 100}ms` }}>
              <div className="step-top">
                <span className="step-icon-lg">{step.icon}</span>
                <span className="step-num">0{i + 1}</span>
              </div>
              <h4 className="step-title">{step.title}</h4>
              <p className="step-desc">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="bot-cta">
          <div className="bot-commands">
            <h4 className="commands-title">Bot Commands</h4>
            <div className="commands-list">
              {[
                ['/start', 'Welcome message & overview'],
                ['/scan', 'Start a new resume analysis'],
                ['/help', 'Show all commands'],
              ].map(([cmd, desc]) => (
                <div className="command-row" key={cmd}>
                  <code className="command-code">{cmd}</code>
                  <span className="command-desc">{desc}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bot-setup-note">
            <div className="note-icon">⚙️</div>
            <div>
              <h4 className="note-title">Connect Your Bot</h4>
              <p className="note-text">
                The "Try Bot" button and links will then open your bot directly in Telegram.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
