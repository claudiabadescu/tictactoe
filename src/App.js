import { useState } from "react";

function Square({ value, onSquareClick }) {
  // pass value and a function to this function
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

// game board
function Board({ xIsNext, squares, onPlay }) {
  // parent board keeps track of state of all children that are squares - before adding history
  // const [xIsNext, setXIsNext] = useState(true); // flip each time to determine turn
  // const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    // returning early if square already has a mark
    // and also if check if a player has won
    if (squares[i] || calculateWinner(squares)) {
      // this means if it is not null
      return;
    }

    const nextSquares = squares.slice(); // creates copy of setSquares

    // check what player is next
    if (xIsNext) {
      // if true
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }

    onPlay(nextSquares); // change state of component
  }

  // calculate winner or next player
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    // if not null
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  // i think this is the html block
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
    </>
  );
}

// this is the main function that has full control over the board data
// export default tells indez.js that Game component is the top-level one
export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0); // which step the user is viewing

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];

    setHistory(nextHistory); // creates new array that contains all items in history and the next
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  // use map to transform history of moves into react elements representing buttons
  // each past move hasa unique key - the sequential number of the move
  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }

    // for each move in history, we create a list item that contains a button, which
    // has an onclick handler which calls the jump to function
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
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
    [2, 4, 6],
  ]; // the wining likes that need to be checked

  // going through 3 and 3 combos
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
