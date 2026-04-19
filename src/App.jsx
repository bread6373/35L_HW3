import * as React from 'react'
import * as ReactBootstrap from 'react-bootstrap'

import { useState } from 'react'

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function App() {
  // const [name, setName] = React.useState('World')
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  const [fullMoveComplete, setFullMove] = useState(false);
  const [start, setStart] = useState(-1);
  const [end, setEnd] = useState(-1);

  function handleClick(i) {
    const nextSquares = squares.slice();
     
    let movesTaken = squares.reduce((acc, curr) => acc + (curr ? 1 : 0), 0);
    // console.log(`Moves taken: ${movesTaken}`);
    
    // logic for setting up both players with 3 tiles
    if (movesTaken < 6) {
      if (squares[i] || calculateWinner(squares)) {
        return;  
      }
      
      if (xIsNext) {
        console.log('X moved')
        nextSquares[i] = "X";
      } else {
        console.log('O moved')
        nextSquares[i] = "O";
      }
      
      setSquares(nextSquares);
      setXIsNext(!xIsNext);
    
    // logic for setting up the rest of the game
    } else {
      if (start === -1 && end === -1) {
        console.log(squares[i])
        if (squares[i] !== null) {
          setStart(-1);
          setEnd(-1);
          return;
        }
          
        setStart(i);
      } else if (start !== -1 && end === -1) {
        console.log(squares[i])
        if (squares[i] !== null || Number(i) === Number(start)) {
          setStart(-1);
          setEnd(-1);
          return;
        }

        setEnd(i);
      } else if (start !== -1 && end !== -1) {
        console.log(squares[i])
        if (squares[i] !== null) {
          setStart(-1);
          setEnd(-1);
          return;
        }

        setStart(i);
        setEnd(-1);
      }
    }
  }

  const winner = calculateWinner(squares);
  let status;

  if (winner) {
    status = `Winner: ${winner}`;
  } else {
    status = `Next player: ${xIsNext ? "X" : "O"}`;
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
      <div>
        Move start: {start !== -1 ? start : "Not chosen"} <br/>
        Move end: {end !== -1 ? end : "Not chosen"} <br/>
      </div>
    </>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// <div className="container py-4">
//   <Card className="starter-card shadow-sm">
//     <Card.Body className="p-4">
//       <h1 className="greeting display-6 fw-bold">Hello, {name}!</h1>
//       <p className="mb-3 text-secondary">
//         This starter is set up to match the React Essentials notes more closely.
//         For the assignment, build the tic-tac-toe tutorial in this file and leave
//         mounting to <code>src/main.jsx</code>.
//       </p>
//       <div className="d-flex gap-2 flex-wrap align-items-center">
//         <Button variant="primary" onClick={() => setName('CS 35L')}>
//           Set example name
//         </Button>
//         <Badge bg="secondary" pill>
//           ReactBootstrap ready
//         </Badge>
//       </div>
//     </Card.Body>
//   </Card>
// </div>