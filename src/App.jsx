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

  const [start, setStart] = useState(-1);
  const [end, setEnd] = useState(-1);
  const [isInvalidMove, setInvalid] = useState(false);
  const [moveErrorCode, setMoveErrorCode] = useState(0);

  function handleClick(i) {
    // If there is a winner, return immediately to prevent further action
    if (calculateWinner(squares)) {
      return;
    }

    const nextSquares = squares.slice();
    let movesTaken = squares.reduce((acc, curr) => acc + (curr ? 1 : 0), 0);
    let turn = xIsNext ? "X" : "O";
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
      // When the player has a to pick a starting move
      if (start === -1 && end === -1) {
        console.log(squares[i])
        
        // player moving a different piece from their own
        if (squares[i] !== turn) {
          setStart(-1);
          setEnd(-1);
          setInvalid(true);
          setMoveErrorCode(1);
          return;
        }
          
        setStart(i);
        setInvalid(false);
        setMoveErrorCode(0);
      
      // When the player has a to pick an ending move
      } else if (start !== -1 && end === -1) {
        console.log(squares[i])

        // player moves to an occupied square
        if (squares[i] !== null || Number(i) === Number(start)) {
          setStart(-1);
          setEnd(-1);
          setInvalid(true);
          setMoveErrorCode(2);
          return;
        }

        const simulatedBoard = squares.slice();
        simulatedBoard[start] = null;
        simulatedBoard[i] = turn;
        const simulatedWinner = calculateWinner(simulatedBoard);
        console.log(`simluated winner: ${simulatedWinner}`)
        
        // validating that a move is to an adjacent square and that the player
        // vacates the center square unless they can win on the next turn,
        if (isAdjacentMove(start, i)) {
          if (squares[4] === turn && simulatedBoard[4] == turn && simulatedWinner !== turn) {
            setInvalid(true);
            setMoveErrorCode(3);
          } else {
            nextSquares[start] = null;
            nextSquares[i] = xIsNext ? "X" : "O";
            console.log(`${nextSquares[start]} to ${nextSquares[end]}`)
            setSquares(nextSquares);
            setXIsNext(!xIsNext);
          }
        } else {
          setInvalid(true);
          setMoveErrorCode(2);
        }
        
        setStart(-1);
        setEnd(-1);
        return;
      }
    }
  }

  // Display winning messages
  const winner = calculateWinner(squares);
  let status;

  if (winner) {
    status = `Winner: ${winner}`;
  } else {
    status = `Next player: ${xIsNext ? "X" : "O"}`;
  }

  let errorMessage;
  switch (moveErrorCode) {
    case 0:
      errorMessage = "No error message."
      break;
    
    case 1:
      errorMessage = "Invalid move: Move your own piece."
      break;
    
    case 2:
      errorMessage = "Invalid move: Move to an empty, neighboring space."
      break;
    
    case 3:
      errorMessage = "Invalid move: You must vacate the center square or win."
      break;
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

      { /* Display information about the current turn's start and end position */}
      <div>
        Move start: {start !== -1 ? start : "Not chosen"} <br/>
        Move end: {end !== -1 ? end : "Not chosen"} <br/>
      </div>
      <div>
        {/* isInvalidMove && "Invalid move" */}
        {moveErrorCode != 0 && errorMessage}
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

function isAdjacentMove(start, end) {
  const validMoves = {
    0: [1, 3, 4],
    1: [0, 2, 3, 4, 5],
    2: [1, 4, 5],
    3: [0, 1, 4, 6, 7],
    4: [0, 1, 2, 3, 5, 6, 7, 8],
    5: [1, 2, 4, 7, 8],
    6: [3, 4, 7],
    7: [3, 4, 5, 6, 8],
    8: [4, 5, 7]
  };

  return validMoves[start].includes(end);
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