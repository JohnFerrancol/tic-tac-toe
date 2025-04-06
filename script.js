window.addEventListener("load", () => {
  const dialogContainer = document.querySelector("dialog");
  dialogContainer.showModal();

  DisplayController.getPlayer2Marker();
});

// Gameboard object is used to manipulate the contents of the gameboard
const Gameboard = (function () {
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

  const markBoard = (marker, index) => {
    gameBoardArray[index] = marker;
  };

  return { displayBoard, getBoardArray, markBoard };
})();

// Player object is used to define the details of the user
const Player = (name, marker) => {
  return { name, marker };
};

// GameController Object used to define the logic flow of the game
const GameController = (function () {
  let player1 = Player("Player 1", "X");
  let player2 = Player("Player 2", "O");
  let currentPlayer = player1;

  const getPlayers = (playersArray) => {
    [player1, player2] = playersArray;
    console.log(player1, player2);
    currentPlayer = player1;
    DisplayController.updateMessage(`${player1.name}'s Turn`);
  };

  // Handling switching of players
  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  // Handle Player turns
  const playTurn = (index) => {
    const currentBoard = Gameboard.getBoardArray();

    // If a game is over (Winner found or it is a tie) or the input is not valid, do nothing
    // Else mark the board
    if (foundWinner() || isTie() || currentBoard[index] !== " ") return;
    else Gameboard.markBoard(currentPlayer.marker, index);

    // If found a winner or it is a tie after marking the board, end the game
    const winner = foundWinner();
    if (winner) {
      DisplayController.renderBoard();
      DisplayController.updateMessage(`${winner.playerName} Won!`);
      DisplayController.showWinningCells(winner.winPattern);
      return;
    } else if (isTie()) {
      DisplayController.renderBoard();
      DisplayController.updateMessage(`Tie!`);
      return;
    } else {
      // Else continue playing
      switchPlayer();
      DisplayController.renderBoard();
      DisplayController.updateMessage(`${currentPlayer.name}'s Turn`);
    }
  };

  // Handling when there is a winner
  const foundWinner = () => {
    const currentBoard = Gameboard.getBoardArray();
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
        const playerName =
          currentBoard[a] === player1.marker ? player1.name : player2.name;
        return { playerName, winPattern };
      }
    }
    return false;
  };

  // Handling when all the squares are filled up and there is no winner
  const isTie = () => {
    if (!Gameboard.getBoardArray().includes(" ")) {
      return true;
    }
    return false;
  };

  return { playTurn, getPlayers };
})();

// GameController Object used to update and handle event listeners in the UI
const DisplayController = (function () {
  const gameCells = document.querySelectorAll(".cell");
  const generatePlayersDialog = document.querySelector(".generate-players");
  const message = document.querySelector(".message");
  const closeDialogIcon = document.querySelector(".close-dialog-icon");
  const selectionMarker = document.querySelector(".select-marker");
  const player2MarkerDisplay = document.querySelector(".player-2-marker");
  const dialogForm = document.querySelector("form");

  // When an individual cell is pressed, run an instance of a turn of tic tac toe
  gameCells.forEach((cell) => {
    cell.addEventListener("click", () => {
      let cellIndex = cell.dataset.index;
      GameController.playTurn(cellIndex);
    });
  });

  const getPlayer2Marker = () => {
    player2MarkerDisplay.textContent = `Player 2's marker: ${
      selectionMarker.value === "X" ? "O" : "X"
    }`;
  };

  selectionMarker.addEventListener("change", getPlayer2Marker);

  dialogForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const player1Name = document.querySelector("#player1-name").value;
    const player2Name = document.querySelector("#player2-name").value;
    const player1Marker = selectionMarker.value;
    const player2Marker = player2MarkerDisplay.textContent.slice(-1);

    const players = [
      Player(player1Name, player1Marker),
      Player(player2Name, player2Marker),
    ];
    GameController.getPlayers(players);
    generatePlayersDialog.close();
  });

  closeDialogIcon.addEventListener("click", () => {
    console.log("I can click you now!");
  });

  // Render the board based on the board array from the Gameboard object
  const renderBoard = () => {
    const boardArray = Gameboard.getBoardArray();

    gameCells.forEach((cell) => {
      let cellIndex = Number(cell.dataset.index);
      cell.textContent = boardArray[cellIndex];
    });
  };

  const updateMessage = (messageUpdate) => {
    message.textContent = messageUpdate;
  };

  // Highlighting the winning pattern by coloring the cells green
  const showWinningCells = (winPattern) => {
    gameCells.forEach((cell) => {
      let cellIndex = Number(cell.dataset.index);
      if (winPattern.includes(cellIndex)) {
        cell.classList.add("winning-cell");
      }
    });
  };

  return { renderBoard, updateMessage, showWinningCells, getPlayer2Marker };
})();
