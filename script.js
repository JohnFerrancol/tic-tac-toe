// Gameboard object is used to manipulate the contents of the gameboard
function Gameboard() {
  let gameBoardArray = ["", "", "", "", "", "", "", "", "", ""];

  const showGameBoard = () => gameBoardArray;

  const markBoard = (marker, position) => {
    gameBoardArray[position - 1] = marker;
    console.log(gameBoardArray);
  };

  return { showGameBoard, markBoard };
}

// Player object is used to define the details of the user
function Player(name, marker) {
  return { name, marker };
}

// GameController Object used to define the logic flow of the game
function GameController() {
  const player1 = Player("Player 1", "X");
  const player2 = Player("Player 2", "O");
  const gameboard = Gameboard();

  // Simulate the two players taking turns
  for (let i = 1; i <= 9; i++) {
    if (i % 2 != 0) {
      console.log(`${player1.name}'s turn`);
      gameboard.markBoard("X", i);
    } else {
      console.log(`${player2.name}'s turn`);
      gameboard.markBoard("O", i);
    }
  }
}

GameController();
