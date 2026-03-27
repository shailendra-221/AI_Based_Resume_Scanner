import React, { useState } from 'react';
import Header from './components/Header';
import UploadSection from './components/UploadSection';
import ResultsSection from './components/ResultsSection';
import TelegramInfo from './components/TelegramInfo';
import ParticleBackground from './components/ParticleBackground';
import './App.css';

function App() {
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="app">
      <ParticleBackground />
      <Header />
      <main className="main-content">
        <HeroSection />
        <UploadSection
          setResults={setResults}
          setIsLoading={setIsLoading}
          isLoading={isLoading}
        />
        {isLoading && <LoadingSection />}
        {results && !isLoading && <ResultsSection results={results} />}
        <TelegramInfo />
      </main>
      <Footer />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-badge">
        <span className="badge-dot" />
        AI-Powered ATS Analyzer
      </div>
      <h1 className="hero-title">
        Land Your Dream Job<br />
        <span className="gradient-text">With a Perfect Resume</span>
      </h1>
      <p className="hero-subtitle">
        Upload your resume and job description. Our AI scores your match,
        identifies gaps, and generates an optimized resume — instantly.
      </p>
      <div className="hero-stats">
        <div className="stat">
          <span className="stat-num">10x</span>
          <span className="stat-label">Faster Analysis</span>
        </div>
        <div className="stat-divider" />
        <div className="stat">
          <span className="stat-num">ATS</span>
          <span className="stat-label">Optimized Output</span>
        </div>
        <div className="stat-divider" />
        <div className="stat">
          <span className="stat-num">AI</span>
          <span className="stat-label">Powered by Claude</span>
        </div>
      </div>
    </section>
  );
}

function LoadingSection() {
  const steps = [
    { icon: '📄', text: 'Parsing documents...' },
    { icon: '🔍', text: 'Analyzing skills match...' },
    { icon: '🧠', text: 'Running AI analysis...' },
    { icon: '✨', text: 'Generating optimized resume...' },
  ];
  const [currentStep, setCurrentStep] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(s => (s + 1) % steps.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-section">
      <div className="loading-orb">
        <div className="orb-ring orb-ring-1" />
        <div className="orb-ring orb-ring-2" />
        <div className="orb-ring orb-ring-3" />
        <span className="orb-icon">⚡</span>
      </div>
      <h3 className="loading-title">Analyzing Your Resume</h3>
      <div className="loading-steps">
        {steps.map((step, i) => (
          <div
            key={i}
            className={`loading-step ${i === currentStep ? 'active' : ''} ${i < currentStep ? 'done' : ''}`}
          >
            <span className="step-icon">{i < currentStep ? '✅' : step.icon}</span>
            <span className="step-text">{step.text}</span>
          </div>
        ))}
      </div>
      <div className="loading-dots">
        <span className="loading-dot" />
        <span className="loading-dot" />
        <span className="loading-dot" />
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <p>Built with ❤️ using MERN Stack  </p>
      <p className="footer-sub">Resume Scanner AI  </p>
    </footer>
  );
}

export default App;
