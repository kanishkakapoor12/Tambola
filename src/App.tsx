import { useState, useEffect, useRef, type Key } from 'react';
import './App.css';

function History(props: any) {
  return (
    <div className="history">
      <h3>Previous Numbers</h3>
      <div className="numberContainer historyContainer">
        {props.h.map((no: number, i: Key) => {
          return (
            <div className="numbers historyNumber" key={i}>
              {no}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function App() {
  const initialClaims = [
    'Early 7',
    'Top Line',
    'Middle Line',
    'Bottom Line',
    '1st House',
    '2nd House',
  ];

  const [original, setOriginal] = useState(
    Array.from({ length: 90 }, (_, i) => i + 1)
  );
  const [history, setHistory] = useState<number[]>([]);
  const [current, setCurrent] = useState(0);
  const [claimed, setClaimed] = useState(false);
  const [allClaims, setAllClaims] = useState(initialClaims);
  const [claims, setClaims] = useState<string[]>([]);
  const [mode, setMode] = useState<'manual' | 'auto'>('manual');
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(2000);
  const [gameOver, setGameOver] = useState(false);

  const intervalRef = useRef<any>(null);
  const board = new Array(90).fill(1);

  const handleClaim = (val: string) => {
    if (!val) return;

    setClaims((prev) => [...prev, val]);
    setAllClaims((prev) => prev.filter((c) => c !== val));
    setClaimed(false);
  };

  const getNewNumber = () => {
    if (!original.length) return;

    const originalClone = [...original];
    const randomIndex = Math.floor(Math.random() * originalClone.length);
    const newNumber = originalClone[randomIndex];

    if (current) setHistory((prev) => [...prev, current]);

    setCurrent(newNumber);

    originalClone.splice(randomIndex, 1);
    setOriginal(originalClone);
  };

  // 🔊 Speak out the number
  const speakNumber = (num: number) => {
    if (!('speechSynthesis' in window)) return;

    let message = '';
    if (num < 10) {
      message = `Only number ${num}`;
    } else {
      const digits = num.toString().split('').join(' ');
      message = `${digits} ${num}`;
    }

    const utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.lang = 'en-GB';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  // Speak whenever current changes
  useEffect(() => {
    if (current !== 0) {
      speakNumber(current);
    }
  }, [current]);

  // Auto mode with pause/resume + speed
  useEffect(() => {
    if (mode === 'auto' && !isPaused && original.length > 0) {
      intervalRef.current = setInterval(() => {
        getNewNumber();
      }, speed);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [mode, isPaused, speed, original]);

  // 🎉 Trigger Game Over when last claim taken
  useEffect(() => {
    if (allClaims.length === 0) {
      setGameOver(true);
      setIsPaused(true); // ⏸️ Pause automatically
    }
  }, [allClaims]);

  const resetGame = () => {
    setOriginal(Array.from({ length: 90 }, (_, i) => i + 1));
    setHistory([]);
    setCurrent(0);
    setAllClaims(initialClaims);
    setClaims([]);
    setClaimed(false);
    setGameOver(false);
    setMode('manual');
    setIsPaused(false);
  };

  // Restrict House claims until others are gone
  const isClaimDisabled = (claim: string) => {
    if (
      (claim === '1st House' || claim === '2nd House') &&
      allClaims.some((c) =>
        ['Early 7', 'Top Line', 'Middle Line', 'Bottom Line'].includes(c)
      )
    ) {
      return true;
    }
    return false;
  };

  return (
    <>
      <h1 className="title">🎉 Welcome to Tambola 🎉</h1>

      {/* Game Over Overlay */}
      {/* Game Over Overlay */}
      {gameOver && (
        <div className="gameOver">
          <div className="gameOverContent">
            <h2>🏆 Game Over! 🏆</h2>
            <button
              onClick={() => {
                setGameOver(false);
                setIsPaused(false); // ▶️ Resume when continuing
              }}
            >
              Continue Anyway
            </button>
            <button onClick={resetGame}>Start New Game</button>
          </div>
        </div>
      )}

      {/* Mode Switch */}
      <div className="modeSwitch">
        <label>
          <input
            type="radio"
            value="manual"
            checked={mode === 'manual'}
            onChange={() => {
              setMode('manual');
              setIsPaused(false);
            }}
          />
          Manual
        </label>
        <label>
          <input
            type="radio"
            value="auto"
            checked={mode === 'auto'}
            onChange={() => {
              setMode('auto');
              setIsPaused(false);
            }}
          />
          Auto
        </label>
      </div>

      {/* Speed Control */}
      {mode === 'auto' && (
        <div className="speedControl">
          <label>
            Speed: {speed / 1000}s
            <input
              type="range"
              min="500"
              max="5000"
              step="500"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
            />
          </label>
          <button onClick={() => setIsPaused(!isPaused)}>
            {isPaused ? '▶️ Resume' : '⏸️ Pause'}
          </button>
        </div>
      )}

      {/* Board */}
      <div className="numberContainer">
        {board.map((_, i) => {
          const num = i + 1;
          return (
            <div
              className="numbers"
              style={{
                backgroundColor:
                  current === num
                    ? 'orange'
                    : history.includes(num)
                    ? 'grey'
                    : 'white',
                color: current === num ? 'white' : 'black',
              }}
              key={i}
            >
              {num}
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="controls">
        {mode === 'manual' && (
          <button disabled={!original.length} onClick={getNewNumber}>
            🎲 New Number
          </button>
        )}
        <div className="current">
          {current !== 0 && <span>Current: {current}</span>}
        </div>
        {!claimed && allClaims.length !== 0 && (
          <button disabled={!original.length} onClick={() => setClaimed(true)}>
            Claim?
          </button>
        )}
        {claimed && (
          <select
            onChange={(e) => handleClaim(e.target.value)}
            className="claims"
          >
            <option value="">-- Select Claim --</option>
            {allClaims.map((item, index) => (
              <option key={index} value={item} disabled={isClaimDisabled(item)}>
                {item}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* History */}
      <History h={history} />

      {/* Claims */}
      {claims.length !== 0 && (
        <div className="claimsList">
          <h3>Claims</h3>
          {claims.map((c, i) => (
            <div className="claimItem" key={i}>
              ✅ {c}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default App;
