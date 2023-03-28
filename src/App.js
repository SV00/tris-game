import { useState } from "react";

function Square({ value, onSquareClick, winner }) {
  let classes = "square";
  classes += winner ? " square-winner" : "";
  return (
    <button className={classes} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) return;
    const list = [
      [0, 0],
      [0, 1],
      [0, 2],
      [1, 0],
      [1, 1],
      [1, 2],
      [2, 0],
      [2, 1],
      [2, 2]
    ];
    const moveRecord = list[i];
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares, moveRecord);
  }

  const winner = calculateWinner(squares);
  let status = winner
    ? `Winner ${winner[0]}`
    : calculateDraw(squares)
    ? `Draw`
    : `Next player ${xIsNext ? "X" : "O"}`;

  return (
    <>
      <div className="status">{status}</div>
      {[0, 1, 2].map((row) => {
        const squaresPerRow = 3;
        const indexRow = row * squaresPerRow;
        return (
          <div key={row} className="board-row">
            {squares
              .slice(indexRow, indexRow + squaresPerRow)
              .map((square, indexSquare) => (
                <Square
                  key={indexSquare}
                  winner={
                    winner &&
                    (winner[1] === indexSquare + indexRow ||
                      winner[2] === indexSquare + indexRow ||
                      winner[3] === indexSquare + indexRow)
                  }
                  value={square}
                  onSquareClick={() => handleClick(indexSquare + indexRow)}
                />
              ))}
          </div>
        );
      })}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [historyMove, setHistoryMove] = useState([Array(2).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [ascOrderMoves, setAscOrderMoves] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares, nextMoveCoordinate) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    const nextHistoryMove = [
      ...historyMove.slice(0, currentMove + 1),
      nextMoveCoordinate
    ];
    setHistoryMove(nextHistoryMove);
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function handleOrderMoves() {
    setAscOrderMoves(!ascOrderMoves);
  }

  const listMoves = ascOrderMoves ? history : history.slice(0).reverse();
  const moves = listMoves.map((squares, move) => {
    const orderMove = ascOrderMoves ? move : history.length - move - 1;
    let description =
      orderMove > 0
        ? `Go to move ${orderMove} (${historyMove[orderMove][0]}, ${historyMove[orderMove][1]})`
        : `Go to game start`;
    return (
      <li key={orderMove}>
        <button onClick={() => jumpTo(orderMove)}>{description}</button>
      </li>
    );
  });

  const statusMove = `You are at move ${currentMove}`;

  return (
    <>
      <div className="status">{statusMove}</div>
      <div className="game">
        <div className="game-board">
          <Board
            xIsNext={xIsNext}
            squares={currentSquares}
            onPlay={handlePlay}
          />
        </div>
        <div className="game-info">
          <button className="order-button" onClick={handleOrderMoves}>
            {ascOrderMoves ? "asc" : "desc"}
          </button>
          <ol>{moves}</ol>
        </div>
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
      return [squares[a], ...lines[i]];
    }
  }
  return null;
}

function calculateDraw(squares) {
  let draw = true;
  for (let i = 0; i < squares.length; i++) {
    if (!squares[i]) draw = false;
  }
  return draw;
}
