// ============================================
// MINI GAMES HUB
// TIC-TAC-TOE GAME
// ============================================


// ============================================
// GAME VARIABLES
// ============================================

let board = Array(9).fill("");

let currentPlayer = "X";

let gameActive = true;

let winningCombination = [];


// All possible winning combinations
const WINNING_COMBINATIONS = [

    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6]

];


// ============================================
// INITIALIZE GAME
// ============================================

export function initializeTicTacToe() {

    const gameStage = document.getElementById("game-stage");

    const gameStatus = document.getElementById("game-status");

    // Create game interface
    gameStage.innerHTML = `

        <div class="tic-tac-toe-container">

            <div class="tic-tac-toe-info">

                <div class="player-indicator active" id="player-x">
                    <span class="player-symbol">X</span>
                    <span>PLAYER 1</span>
                </div>

                <div class="player-indicator" id="player-o">
                    <span class="player-symbol">O</span>
                    <span>PLAYER 2</span>
                </div>

            </div>

            <div class="tic-tac-toe-board" id="tic-tac-toe-board">

                ${Array.from({ length: 9 }, (_, index) => `
                    <button
                        class="tic-cell"
                        data-index="${index}"
                        aria-label="Cell ${index + 1}"
                    ></button>
                `).join("")}

            </div>

        </div>

    `;


    // Reset game state
    board = Array(9).fill("");

    currentPlayer = "X";

    gameActive = true;

    winningCombination = [];


    // Update status
    gameStatus.textContent = "Player X's turn";


    // Attach cell events
    const cells = document.querySelectorAll(".tic-cell");

    cells.forEach(cell => {

        cell.addEventListener("click", handleCellClick);

    });

}


// ============================================
// HANDLE CELL CLICK
// ============================================

function handleCellClick(event) {

    const cell = event.currentTarget;

    const index = Number(cell.dataset.index);


    // Prevent invalid moves
    if (!gameActive || board[index] !== "") {
        return;
    }


    // Update board
    board[index] = currentPlayer;

    cell.textContent = currentPlayer;

    cell.classList.add(`cell-${currentPlayer.toLowerCase()}`);

    cell.disabled = true;


    // Check for winner
    if (checkWinner()) {

        gameActive = false;

        highlightWinningCells();

        document.getElementById("game-status").textContent =
            `🎉 Player ${currentPlayer} wins!`;

        return;

    }


    // Check for draw
    if (board.every(value => value !== "")) {

        gameActive = false;

        document.getElementById("game-status").textContent =
            "🤝 It's a draw!";

        return;

    }


    // Switch players
    switchPlayer();

}


// ============================================
// SWITCH PLAYER
// ============================================

function switchPlayer() {

    currentPlayer = currentPlayer === "X" ? "O" : "X";


    // Update game status
    document.getElementById("game-status").textContent =
        `Player ${currentPlayer}'s turn`;


    // Update player indicators
    document.getElementById("player-x").classList.toggle(
        "active",
        currentPlayer === "X"
    );

    document.getElementById("player-o").classList.toggle(
        "active",
        currentPlayer === "O"
    );

}


// ============================================
// CHECK WINNER
// ============================================

function checkWinner() {

    for (const combination of WINNING_COMBINATIONS) {

        const [a, b, c] = combination;


        if (
            board[a] !== "" &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {

            winningCombination = combination;

            return true;

        }

    }

    return false;

}


// ============================================
// HIGHLIGHT WINNING CELLS
// ============================================

function highlightWinningCells() {

    winningCombination.forEach(index => {

        const cell = document.querySelector(
            `.tic-cell[data-index="${index}"]`
        );

        if (cell) {
            cell.classList.add("winning-cell");
        }

    });

}


// ============================================
// CLEANUP GAME
// ============================================

export function cleanupTicTacToe() {

    board = Array(9).fill("");

    currentPlayer = "X";

    gameActive = false;

    winningCombination = [];

}