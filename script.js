// Gameboard object is used to manipulate the contents of the gameboard
function Gameboard() {
  let gameBoardArray = [" ", " ", " ", " ", " ", " ", " ", " ", " "];

  const displayBoard = () => {
    console.log(`
        ${gameBoardArray.slice(0, 3).join(" | ")}
        ---------
        ${gameBoardArray.slice(3, 6).join(" | ")}
        ---------
        ${gameBoardArray.slice(6, 9).join(" | ")}
      `);
  };

  const getBoardArray = () => gameBoardArray;

  const markBoard = (marker, position) => {
    gameBoardArray[position - 1] = marker;
  };

  return { displayBoard, getBoardArray, markBoard };
}

// Player object is used to define the details of the user
function Player(name, marker) {
  return { name, marker };
}

// GameController Object used to define the logic flow of the game
function GameController() {
  const player1 = Player("Player 1", "X");
  const player2 = Player("Player 2", "O");
  let currentPlayer = player1;
  const gameboard = Gameboard();

  // Handling switching of players
  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  // Handle Player turns
  const playTurn = () => {
    console.log(`${currentPlayer.name}'s turn`);
    gameboard.displayBoard();
    let currentBoard = gameboard.getBoardArray();

    // Keep prompting for a valid position and ensure that the position is not taken
    while (true) {
      let desiredPosition = Number(
        prompt("Enter desired position, Enter a number from 1-9")
      );

      if (!(1 <= desiredPosition && desiredPosition <= 9)) {
        alert("Error! Enter a Position from 1-9! ");
      } else if (currentBoard[desiredPosition - 1] != " ") {
        alert("Error! Position already taken up! ");
      } else {
        gameboard.markBoard(currentPlayer.marker, desiredPosition);
        break;
      }
    }

    switchPlayer();
  };

  // Handling when there is a winner
  const foundWinner = () => {
    const currentBoard = gameboard.getBoardArray();
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // horizontal
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // vertical
      [0, 4, 8],
      [2, 4, 6], // diagonal
    ];

    // For every round check if there are any win patterns
    for (const winPattern of winPatterns) {
      // Decontruct win pattern
      const [a, b, c] = winPattern;

      // Only ensure that index a,b,c are populated with "X" or "O" and not " "
      if (
        (currentBoard[a] === "X" || currentBoard[a] === "O") &&
        currentBoard[a] === currentBoard[b] &&
        currentBoard[a] === currentBoard[c]
      ) {
        console.log(
          `${currentBoard[a] === "X" ? player1.name : player2.name} wins!`
        );
        return true;
      }
    }
    return false;
  };

  // Handling when all the squares are filled up and there is no winner
  const isTie = () => {
    if (!gameboard.getBoardArray().includes(" ")) {
      console.log("Tie!");
      return true;
    }
    return false;
  };

  // Handling playing the turn
  const playGame = () => {
    while (true) {
      if (foundWinner() || isTie()) {
        break;
      }
      playTurn();
    }

    console.log("Game Over");
    gameboard.displayBoard();
  };

  playGame();
}

GameController();
