// ============================================
// MINI GAMES HUB
// MAIN APPLICATION
// ============================================

import { initializeNavigation } from "./navigation.js";

// Tic-Tac-Toe
import {
    initializeTicTacToe,
    cleanupTicTacToe
} from "./games/tic-tac-toe.js";

// Rock Paper Scissors
import {
    initializeRockPaperScissors,
    cleanupRockPaperScissors
} from "./games/rock-paper-scissors.js";

// Memory Match
import {
    initializeMemory,
    cleanupMemory
} from "./games/memory.js";

// Snake
import {
    initializeSnake,
    cleanupSnake
} from "./games/snake.js";


// ============================================
// GAME REGISTRY
// ============================================

const gameRegistry = {

    "tic-tac-toe": {
        initialize: initializeTicTacToe,
        cleanup: cleanupTicTacToe
    },

    "rock-paper-scissors": {
        initialize: initializeRockPaperScissors,
        cleanup: cleanupRockPaperScissors
    },

    "memory": {
        initialize: initializeMemory,
        cleanup: cleanupMemory
    },

    "snake": {
        initialize: initializeSnake,
        cleanup: cleanupSnake
    }

};


// ============================================
// ACTIVE GAME
// ============================================

let activeGame = null;
let activeGameName = null;


// ============================================
// LOAD GAME
// ============================================

export function loadGame(gameName) {

    console.log("Requested game:", gameName);

    // Clean up previous game
    if (activeGame && activeGame.cleanup) {
        activeGame.cleanup();
    }

    activeGame = null;
    activeGameName = null;

    // Find game
    const game = gameRegistry[gameName];

    // Check if game exists
    if (!game) {

        console.error("Game module not found:", gameName);

        document.getElementById("game-title").textContent =
            "Game Not Available";

        document.getElementById("game-status").textContent =
            `The game "${gameName}" has not been implemented yet.`;

        document.getElementById("game-stage").innerHTML = `
            <div style="text-align:center; padding:40px; color:white;">
                <h2>🚧 Coming Soon!</h2>
                <p>This game is currently under development.</p>
            </div>
        `;

        return;
    }

    // Store active game
    activeGame = game;
    activeGameName = gameName;

    // Initialize selected game
    game.initialize();

    console.log(`${gameName} loaded successfully!`);
}


// ============================================
// RETURN HOME
// ============================================

export function unloadGame() {

    if (activeGame && activeGame.cleanup) {
        activeGame.cleanup();
    }

    activeGame = null;
    activeGameName = null;
}


// ============================================
// INITIALIZE APPLICATION
// ============================================

function initializeApp() {

    console.log("Mini Games Hub starting...");

    // Initialize navigation
    initializeNavigation();

    // Game selection event
    window.addEventListener("gameSelected", (event) => {

        const gameName = event.detail.gameName;

        console.log("Game selected from navigation:", gameName);

        loadGame(gameName);

    });

    // Return home event
    window.addEventListener("returnHome", () => {
        unloadGame();
    });

    // Restart game button
    const restartButton = document.getElementById("restart-btn");

    if (restartButton) {

        restartButton.addEventListener("click", () => {

            if (activeGame) {
                activeGame.cleanup();
                activeGame.initialize();
            }

        });

    }

    console.log("Mini Games Hub ready!");
}


// Start application
initializeApp();