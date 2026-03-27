import React, { useEffect, useState } from 'react';
import './ResultsSection.css';

export default function ResultsSection({ results }) {
  const {
    score, scoreBreakdown, matchedSkills, missingSkills,
    strengths, weaknesses, recommendations, summary, downloadUrl
  } = results;

  const scoreColor = score >= 7 ? 'green' : score >= 5 ? 'yellow' : 'red';
  const scoreLabel = score >= 7 ? 'Excellent Match' : score >= 5 ? 'Fair Match' : 'Low Match';
  const scoreEmoji = score >= 7 ? '🎯' : score >= 5 ? '⚡' : '🔧';

  return (
    <section className="results-section" id="results">
      <div className="section-label">
        <span className="label-number">02</span>
        <span className="label-text">Analysis Results</span>
      </div>

      {/* Score Hero */}
      <div className="score-hero animate-fade-up">
        <div className="score-left">
          <div className={`score-ring-wrapper ${scoreColor}`}>
            <ScoreRing score={score} color={scoreColor} />
          </div>
          <div className="score-meta">
            <span className="score-emoji">{scoreEmoji}</span>
            <h2 className="score-label">{scoreLabel}</h2>
            <p className="score-summary">{summary}</p>
          </div>
        </div>

        {/* Breakdown bars */}
        {scoreBreakdown && (
          <div className="score-breakdown">
            <h4 className="breakdown-title">Score Breakdown</h4>
            {Object.entries(scoreBreakdown).map(([key, val], i) => (
              <ScoreBar
                key={key}
                label={key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
                value={val}
                delay={i * 120}
              />
            ))}
          </div>
        )}
      </div>

      {/* Skills Grid */}
      <div className="skills-grid">
        {matchedSkills?.length > 0 && (
          <SkillsCard
            title="✅ Matched Skills"
            skills={matchedSkills}
            variant="matched"
            delay={100}
          />
        )}
        {missingSkills?.length > 0 && (
          <SkillsCard
            title="❌ Missing Skills"
            skills={missingSkills}
            variant="missing"
            delay={200}
          />
        )}
      </div>

      {/* Strengths & Weaknesses */}
      <div className="sw-grid">
        {strengths?.length > 0 && (
          <InsightCard title="💪 Strengths" items={strengths} variant="strength" delay={150} />
        )}
        {weaknesses?.length > 0 && (
          <InsightCard title="⚠️ Areas to Improve" items={weaknesses} variant="weakness" delay={250} />
        )}
      </div>

      {/* Recommendations */}
      {recommendations?.length > 0 && (
        <div className="recommendations-card" style={{ animationDelay: '0.3s' }}>
          <div className="rec-header">
            <span className="rec-icon">💡</span>
            <div>
              <h3 className="rec-title">AI Recommendations</h3>
              <p className="rec-subtitle">Actionable steps to improve your resume for this role</p>
            </div>
          </div>
          <div className="rec-list">
            {recommendations.map((rec, i) => (
              <div className="rec-item" key={i} style={{ animationDelay: `${0.35 + i * 0.08}s` }}>
                <span className="rec-num">{String(i + 1).padStart(2, '0')}</span>
                <p className="rec-text">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Download Card */}
      {downloadUrl && (
        <div className="download-card animate-fade-up" style={{ animationDelay: '0.5s' }}>
          <div className="download-left">
            <div className="download-icon-wrap">
              <span className="download-icon">📄</span>
              <div className="download-pulse" />
            </div>
            <div className="download-info">
              <h3 className="download-title">Your Optimized Resume is Ready!</h3>
              <p className="download-subtitle">
                AI-enhanced resume tailored for this job, ATS-optimized with matched keywords
              </p>
              <div className="download-tags">
                <span className="tag">ATS Optimized</span>
                <span className="tag">Keyword Rich</span>
                <span className="tag">Professional Format</span>
              </div>
            </div>
          </div>
          <a href={downloadUrl} download className="download-btn" target="_blank" rel="noopener noreferrer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="7,10 12,15 17,10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download Resume PDF
          </a>
        </div>
      )}
    </section>
  );
}

function ScoreRing({ score, color }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const progress = (animatedScore / 10) * circumference;

  useEffect(() => {
    let start = 0;
    const step = () => {
      start += 0.2;
      if (start >= score) { setAnimatedScore(score); return; }
      setAnimatedScore(parseFloat(start.toFixed(1)));
      requestAnimationFrame(step);
    };
    const timeout = setTimeout(() => requestAnimationFrame(step), 400);
    return () => clearTimeout(timeout);
  }, [score]);

  const colorMap = { green: '#10b981', yellow: '#f59e0b', red: '#ef4444' };
  const strokeColor = colorMap[color] || '#e94560';

  return (
    <div className="score-ring">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
        <circle
          cx="70" cy="70" r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          transform="rotate(-90 70 70)"
          style={{ transition: 'stroke-dashoffset 0.1s linear', filter: `drop-shadow(0 0 8px ${strokeColor}80)` }}
        />
      </svg>
      <div className="score-ring-inner">
        <span className="score-number" style={{ color: strokeColor }}>
          {animatedScore.toFixed(1)}
        </span>
        <span className="score-denom">/10</span>
      </div>
    </div>
  );
}

function ScoreBar({ label, value, delay }) {
  const [width, setWidth] = useState(0);
  const color = value >= 7 ? '#10b981' : value >= 5 ? '#f59e0b' : '#ef4444';

  useEffect(() => {
    const t = setTimeout(() => setWidth((value / 10) * 100), 500 + delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return (
    <div className="score-bar-row">
      <div className="score-bar-label">
        <span>{label}</span>
        <span style={{ color }} className="score-bar-val">{value}/10</span>
      </div>
      <div className="score-bar-track">
        <div
          className="score-bar-fill"
          style={{ width: `${width}%`, background: color, boxShadow: `0 0 8px ${color}60` }}
        />
      </div>
    </div>
  );
}

function SkillsCard({ title, skills, variant, delay }) {
  return (
    <div className={`skills-card ${variant}`} style={{ animationDelay: `${delay}ms` }}>
      <h3 className="skills-title">{title}</h3>
      <div className="skills-chips">
        {skills.map((skill, i) => (
          <span key={i} className={`skill-chip ${variant}`}>{skill}</span>
        ))}
      </div>
    </div>
  );
}

function InsightCard({ title, items, variant, delay }) {
  return (
    <div className={`insight-card ${variant}`} style={{ animationDelay: `${delay}ms` }}>
      <h3 className="insight-title">{title}</h3>
      <ul className="insight-list">
        {items.map((item, i) => (
          <li key={i} className="insight-item">
            <span className={`insight-dot ${variant}`} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
