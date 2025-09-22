import { useState, type Key } from 'react';
import './App.css';

function History(props: any) {
  return (
    <div className="history">
      Previous numbers :{' '}
      <div className="numberContainer">
        {props.h.map((no: number, i: Key) => {
          return (
            <div className="numbers" key={i}>
              {no}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function App() {
  const [original, setOriginal] = useState([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
    60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78,
    79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90,
  ]);
  const [history, setHistory] = useState<number[]>([]);
  const [current, setCurrent] = useState(0);
  const [claimed, setClaimed] = useState(false);
  const [allClaims, setAllClaims] = useState([
    'Early 7',
    'Top Line',
    'Middle Line',
    'Bottom Line',
    '1st House',
    '2nd House',
  ]);
  const [claims, setClaims] = useState<string[]>([]);
  const board = new Array(90).fill(1);
  const handleClaim = (val: string) => {
    setClaims((prev) => [...prev, val]);
    let AllClaimsClone = [...allClaims];
    AllClaimsClone.splice(AllClaimsClone.indexOf(val), 1);
    setAllClaims(AllClaimsClone);
    setClaimed(false);
  };
  const getNewNumber = () => {
    if (!original.length) return;

    const originalClone = [...original];
    const randomIndex = Math.floor(Math.random() * originalClone.length);
    const newNumber = originalClone[randomIndex];

    // Move the old current into history
    if (current) {
      setHistory((prev) => [...prev, current]);
    }

    // Update current with the freshly chosen number
    setCurrent(newNumber);

    // Remove the new number from the pool
    originalClone.splice(randomIndex, 1);
    setOriginal(originalClone);
  };

  return (
    <>
      <h1>Welcome to Tambola</h1>
      <div className="numberContainer">
        {board.map((el, i) => {
          console.log(el);
          return (
            <div
              className="numbers"
              style={{
                backgroundColor:
                  history.includes(i + 1) || current == i + 1
                    ? 'grey'
                    : 'white',
              }}
              key={i}
            >
              {i + 1}
            </div>
          );
        })}
      </div>
      <div className="currentConatiner">
        <button disabled={!original.length} onClick={getNewNumber}>
          New Number
        </button>
        <div className="current">{current != 0 && <>{current}</>}</div>
        {!claimed && allClaims.length != 0 && (
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
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>
        )}
      </div>

      <History h={history} />
      {claims.length != 0 && (
        <div>
          {' '}
          Claims:
          {claims.map((c, i) => (
            <div key={i}>{c}</div>
          ))}
        </div>
      )}
    </>
  );
}

export default App;
