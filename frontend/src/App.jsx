import React, { useState, useEffect, useRef } from 'react';
import './index.css';

const PHASES = {
  START: 'START',
  SHOW: 'SHOW',
  HIDE: 'HIDE',
  INPUT: 'INPUT',
  FEEDBACK: 'FEEDBACK'
};

const SHAPES = ['shape-dot', 'shape-square', 'shape-triangle', 'shape-star'];
const COLORS = ['color-red', 'color-green', 'color-blue', 'color-yellow'];

const App = () => {
  const [level, setLevel] = useState(1);
  const [phase, setPhase] = useState(PHASES.START);
  const [gridSize, setGridSize] = useState(3);
  const [pattern, setPattern] = useState([]);
  const [userClicks, setUserClicks] = useState([]);
  const [results, setResults] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalScore, setTotalScore] = useState(0);

  const timerRef = useRef(null);
  const startTimeRef = useRef(0);

  const getLevelConfig = (lvl) => {
    if (lvl === 1) return { size: 3, count: 3, time: 3.0 };
    if (lvl === 2) return { size: 3, count: 5, time: 2.5 };
    if (lvl === 3) return { size: 4, count: 6, time: 2.0 };
    if (lvl === 4) return { size: 4, count: 8, time: 1.8 };
    return { size: 5, count: 10 + (lvl - 5) * 2, time: 1.5 };
  };

  const generatePattern = () => {
    const { size, count } = getLevelConfig(level);
    setGridSize(size);
    const newPattern = Array(size).fill().map(() => Array(size).fill(0));
    let placed = 0;
    while (placed < count) {
      const r = Math.floor(Math.random() * size);
      const c = Math.floor(Math.random() * size);
      if (newPattern[r][c] === 0) {
        newPattern[r][c] = {
          shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
          color: COLORS[Math.floor(Math.random() * COLORS.length)]
        };
        placed++;
      }
    }
    setPattern(newPattern);
    setPhase(PHASES.SHOW);
    
    const { time } = getLevelConfig(level);
    setTimeLeft(time);
  };

  useEffect(() => {
    if (phase === PHASES.SHOW) {
      const { time } = getLevelConfig(level);
      let remaining = time;
      const interval = setInterval(() => {
        remaining -= 0.1;
        setTimeLeft(remaining);
        if (remaining <= 0) {
          clearInterval(interval);
          startInputPhase();
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [phase]);

  const startInputPhase = () => {
    setPhase(PHASES.INPUT);
    setUserClicks([]);
    startTimeRef.current = performance.now();
  };

  const handleCellClick = (r, c, e) => {
    if (phase !== PHASES.INPUT) return;

    // Create ripple effect
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    const rect = e.currentTarget.getBoundingClientRect();
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top = `${e.clientY - rect.top}px`;
    e.currentTarget.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);

    const clickTime = performance.now() - startTimeRef.current;
    const isCorrect = pattern[r][c] !== 0;
    
    // Avoid double clicks on same cell
    if (userClicks.find(click => click.cell[0] === r && click.cell[1] === c)) return;

    const newClick = { cell: [r, c], time: clickTime, correct: isCorrect };
    const updatedClicks = [...userClicks, newClick];
    setUserClicks(updatedClicks);

    const { count } = getLevelConfig(level);
    if (updatedClicks.length >= count || !isCorrect) {
      evaluateGame(updatedClicks);
    }
  };

  const evaluateGame = async (clicks) => {
    setPhase(PHASES.FEEDBACK);
    
    const payload = {
      level,
      grid_size: gridSize,
      pattern: pattern.map(row => row.map(cell => cell ? 1 : 0)),
      user_clicks: clicks.map(c => ({ cell: c.cell, time: c.time }))
    };

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      setResults(data);
      setTotalScore(prev => prev + data.score);
    } catch (error) {
      console.error("Evaluation failed", error);
    }
  };

  const nextLevel = () => {
    if (results?.accuracy >= 80) {
      setLevel(prev => prev + 1);
    }
    setPhase(PHASES.START);
    setResults(null);
  };

  return (
    <div className="app-container">
      <header className="header glass-panel fade-in">
        <div className="logo">NeuroPlay</div>
        <div className="stats">
          <div className="stat-item">
            <span className="stat-label">Level</span>
            <span className="stat-value">{level}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Total Score</span>
            <span className="stat-value">{Math.round(totalScore)}</span>
          </div>
        </div>
      </header>

      <main className="game-area glass-panel fade-in">
        {phase === PHASES.START && (
          <div className="start-screen">
            <h1 className="score-title">Ready for Level {level}?</h1>
            <button className="btn" onClick={generatePattern}>START PHASE</button>
          </div>
        )}

        {(phase === PHASES.SHOW || phase === PHASES.INPUT || phase === PHASES.FEEDBACK) && (
          <div className="grid-container">
            {phase === PHASES.SHOW && (
               <div style={{textAlign: 'center', marginBottom: '1rem'}}>
                  <div className="stat-label">Memorize Pattern</div>
                  <div className="timer-container">
                    <div 
                      className="timer-bar" 
                      style={{ width: `${(timeLeft / getLevelConfig(level).time) * 100}%` }}
                    ></div>
                  </div>
               </div>
            )}
            
            <div className="grid" style={{ 
              gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
              opacity: phase === PHASES.HIDE ? 0 : 1
            }}>
              {pattern.map((row, r) => 
                row.map((cell, c) => {
                  const userClick = userClicks.find(clk => clk.cell[0] === r && clk.cell[1] === c);
                  let cellClass = "cell";
                  if (userClick) {
                    cellClass += userClick.correct ? " correct" : " wrong";
                  }

                  return (
                    <div 
                      key={`${r}-${c}`} 
                      className={cellClass}
                      onClick={(e) => handleCellClick(r, c, e)}
                    >
                      {((phase === PHASES.SHOW && cell) || (userClick && cell)) && (
                        <div className={`element visible ${cell.shape} ${cell.color}`}></div>
                      )}
                      {userClick && !userClick.correct && (
                        <div className="element visible shape-dot color-red" style={{transform: 'scale(0.5)'}}></div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {results && (
          <div className="overlay">
            <div className="scorecard glass-panel fade-in">
              <h2 className="score-title">LEVEL {level} RESULT</h2>
              
              <div className="score-metrics">
                <div className="metric-card">
                  <span className="metric-value">{results.accuracy}%</span>
                  <span className="metric-label">Memory</span>
                </div>
                <div className="metric-card">
                  <span className="metric-value">{results.avg_reaction}s</span>
                  <span className="metric-label">Reflex</span>
                </div>
                <div className="metric-card">
                  <span className="metric-value">{results.consistency}</span>
                  <span className="metric-label">Consistency</span>
                </div>
                <div className="metric-card">
                  <span className="metric-value">{Math.round(results.score)}</span>
                  <span className="metric-label">Points</span>
                </div>
              </div>

              <p className="feedback-text">"{results.feedback}"</p>
              
              <button className="btn" onClick={nextLevel}>
                {results.accuracy >= 80 ? "NEXT LEVEL" : "RETRY LEVEL"}
              </button>
            </div>
          </div>
        )}
      </main>
      
      <footer style={{ textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
        Adaptive Cognitive Grid Game • Powered by C Scoring Engine
      </footer>
    </div>
  );
};

export default App;
