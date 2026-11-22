// ============================================
// MINI GAMES HUB
// MEMORY MATCH GAME
// ============================================


// ============================================
// GAME VARIABLES
// ============================================

let cards = [];

let flippedCards = [];

let matchedPairs = 0;

let moves = 0;

let gameActive = true;

let timerInterval = null;

let elapsedSeconds = 0;


// ============================================
// CARD SYMBOLS
// ============================================

const CARD_SYMBOLS = [
    "🎮",
    "🎲",
    "🎯",
    "🎨",
    "🚀",
    "⚡",
    "🎵",
    "🌟"
];


// ============================================
// INITIALIZE GAME
// ============================================

export function initializeMemory() {

    const gameStage = document.getElementById("game-stage");

    const gameStatus = document.getElementById("game-status");


    // Reset game variables
    cards = [];

    flippedCards = [];

    matchedPairs = 0;

    moves = 0;

    gameActive = true;

    elapsedSeconds = 0;


    // Stop any previous timer
    clearInterval(timerInterval);

    timerInterval = null;


    // Duplicate symbols to create pairs
    cards = [...CARD_SYMBOLS, ...CARD_SYMBOLS];


    // Shuffle cards
    shuffleCards(cards);


    // Create game interface
    gameStage.innerHTML = `
        <div class="memory-container">

            <div class="memory-info">

                <div class="memory-stat">
                    <span class="memory-label">MOVES</span>
                    <span id="memory-moves">0</span>
                </div>

                <div class="memory-stat">
                    <span class="memory-label">TIME</span>
                    <span id="memory-timer">00:00</span>
                </div>

                <div class="memory-stat">
                    <span class="memory-label">MATCHED</span>
                    <span id="memory-matched">0 / 8</span>
                </div>

            </div>


            <div class="memory-board" id="memory-board"></div>

        </div>
    `;


    // Create cards
    const memoryBoard = document.getElementById("memory-board");

    cards.forEach((symbol, index) => {

        const card = document.createElement("button");

        card.className = "memory-card";

        card.dataset.symbol = symbol;

        card.dataset.index = index;

        card.innerHTML = `
            <span class="memory-card-inner">
                <span class="memory-card-front">?</span>
                <span class="memory-card-back">${symbol}</span>
            </span>
        `;

        card.addEventListener("click", () => {
            flipCard(card);
        });

        memoryBoard.appendChild(card);

    });


    gameStatus.textContent = "Find all 8 matching pairs!";


    // Start timer
    startTimer();

}


// ============================================
// SHUFFLE CARDS
// ============================================

function shuffleCards(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const randomIndex = Math.floor(Math.random() * (i + 1));

        [array[i], array[randomIndex]] =
            [array[randomIndex], array[i]];

    }

}


// ============================================
// FLIP CARD
// ============================================

function flipCard(card) {

    if (!gameActive) return;

    if (card.classList.contains("flipped")) return;

    if (card.classList.contains("matched")) return;

    if (flippedCards.length === 2) return;


    // Flip selected card
    card.classList.add("flipped");

    flippedCards.push(card);


    // Check when two cards are flipped
    if (flippedCards.length === 2) {

        moves++;

        updateMoves();

        checkMatch();

    }

}


// ============================================
// CHECK MATCH
// ============================================

function checkMatch() {

    const [card1, card2] = flippedCards;

    const gameStatus = document.getElementById("game-status");


    if (card1.dataset.symbol === card2.dataset.symbol) {

        // Match found
        card1.classList.add("matched");

        card2.classList.add("matched");

        matchedPairs++;

        updateMatched();


        flippedCards = [];


        gameStatus.textContent = "Match found! 🎉";


        // Check win condition
        if (matchedPairs === CARD_SYMBOLS.length) {

            endGame();

        }

    } else {

        // No match
        gameStatus.textContent = "No match! Try again.";


        setTimeout(() => {

            card1.classList.remove("flipped");

            card2.classList.remove("flipped");

            flippedCards = [];

            if (gameActive) {
                gameStatus.textContent = "Find the matching pairs!";
            }

        }, 900);

    }

}


// ============================================
// UPDATE MOVES
// ============================================

function updateMoves() {

    document.getElementById("memory-moves").textContent = moves;

}


// ============================================
// UPDATE MATCHED PAIRS
// ============================================

function updateMatched() {

    document.getElementById("memory-matched").textContent =
        `${matchedPairs} / ${CARD_SYMBOLS.length}`;

}


// ============================================
// TIMER
// ============================================

function startTimer() {

    timerInterval = setInterval(() => {

        if (!gameActive) return;

        elapsedSeconds++;

        updateTimer();

    }, 1000);

}


// ============================================
// UPDATE TIMER DISPLAY
// ============================================

function updateTimer() {

    const minutes = Math.floor(elapsedSeconds / 60);

    const seconds = elapsedSeconds % 60;

    const formattedTime =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    document.getElementById("memory-timer").textContent = formattedTime;

}


// ============================================
// END GAME
// ============================================

function endGame() {

    gameActive = false;

    clearInterval(timerInterval);


    const gameStatus = document.getElementById("game-status");

    gameStatus.textContent =
        `🏆 You completed the game in ${moves} moves and ${formatTime(elapsedSeconds)}!`;


    const memoryBoard = document.getElementById("memory-board");

    memoryBoard.insertAdjacentHTML("beforeend", `
        <div class="memory-win-message">
            <h2>🎉 Congratulations!</h2>
            <p>You found all the pairs!</p>
            <p>Moves: ${moves}</p>
            <p>Time: ${formatTime(elapsedSeconds)}</p>
        </div>
    `);

}


// ============================================
// FORMAT TIME
// ============================================

function formatTime(seconds) {

    const minutes = Math.floor(seconds / 60);

    const remainingSeconds = seconds % 60;

    return `${minutes}m ${remainingSeconds}s`;

}


// ============================================
// CLEANUP GAME
// ============================================

export function cleanupMemory() {

    gameActive = false;

    clearInterval(timerInterval);

    timerInterval = null;

    cards = [];

    flippedCards = [];

    matchedPairs = 0;

    moves = 0;

    elapsedSeconds = 0;

}