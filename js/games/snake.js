// ============================================
// MINI GAMES HUB
// SNAKE GAME
// ============================================


// ============================================
// GAME VARIABLES
// ============================================

let canvas;
let ctx;

let snake = [];

let food = {};

let direction = "right";
let nextDirection = "right";

let score = 0;

let gameActive = false;

let gameLoop = null;

const GRID_SIZE = 20;
const TILE_COUNT = 20;

const GAME_SPEED = 120;


// ============================================
// INITIALIZE GAME
// ============================================

export function initializeSnake() {

    const gameStage = document.getElementById("game-stage");
    const gameStatus = document.getElementById("game-status");

    // Reset variables
    snake = [
        { x: 5, y: 10 },
        { x: 4, y: 10 },
        { x: 3, y: 10 }
    ];

    direction = "right";
    nextDirection = "right";

    score = 0;

    gameActive = true;

    clearInterval(gameLoop);
    gameLoop = null;


    // Create game interface
    gameStage.innerHTML = `
        <div class="snake-container">

            <div class="snake-scoreboard">
                <span class="snake-score-label">SCORE</span>
                <span id="snake-score">0</span>
            </div>

            <div class="snake-canvas-wrapper">
                <canvas
                    id="snake-canvas"
                    width="400"
                    height="400"
                ></canvas>
            </div>

            <div class="snake-controls-info">
                <p>Use <strong>Arrow Keys</strong> or <strong>WASD</strong> to move</p>
            </div>

        </div>
    `;


    // Get canvas
    canvas = document.getElementById("snake-canvas");
    ctx = canvas.getContext("2d");


    // Spawn first food
    spawnFood();


    // Draw initial game
    drawGame();


    gameStatus.textContent = "Eat the food and avoid hitting yourself!";


    // Keyboard controls
    window.addEventListener("keydown", handleKeyPress);


    // Start game loop
    gameLoop = setInterval(updateGame, GAME_SPEED);

}


// ============================================
// KEYBOARD CONTROLS
// ============================================

function handleKeyPress(event) {

    if (!gameActive) return;

    const key = event.key.toLowerCase();


    // Prevent page scrolling with arrow keys
    if (
        ["arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key)
    ) {
        event.preventDefault();
    }


    // Change direction
    switch (key) {

        case "arrowup":
        case "w":
            if (direction !== "down") {
                nextDirection = "up";
            }
            break;

        case "arrowdown":
        case "s":
            if (direction !== "up") {
                nextDirection = "down";
            }
            break;

        case "arrowleft":
        case "a":
            if (direction !== "right") {
                nextDirection = "left";
            }
            break;

        case "arrowright":
        case "d":
            if (direction !== "left") {
                nextDirection = "right";
            }
            break;

    }

}


// ============================================
// UPDATE GAME
// ============================================

function updateGame() {

    if (!gameActive) return;


    direction = nextDirection;


    // Calculate new head position
    const head = { ...snake[0] };


    switch (direction) {

        case "up":
            head.y--;
            break;

        case "down":
            head.y++;
            break;

        case "left":
            head.x--;
            break;

        case "right":
            head.x++;
            break;

    }


    // Check wall collision
    if (
        head.x < 0 ||
        head.y < 0 ||
        head.x >= TILE_COUNT ||
        head.y >= TILE_COUNT
    ) {
        endGame();
        return;
    }


    // Check food
    const ateFood =
        head.x === food.x &&
        head.y === food.y;


    // Check snake collision
    const collisionBody = ateFood
        ? snake
        : snake.slice(0, -1);


    if (
        collisionBody.some(segment =>
            segment.x === head.x &&
            segment.y === head.y
        )
    ) {
        endGame();
        return;
    }


    // Move snake
    snake.unshift(head);


    if (ateFood) {

        score += 10;

        document.getElementById("snake-score").textContent = score;

        spawnFood();

    } else {

        snake.pop();

    }


    drawGame();

}


// ============================================
// SPAWN FOOD
// ============================================

function spawnFood() {

    do {

        food = {
            x: Math.floor(Math.random() * TILE_COUNT),
            y: Math.floor(Math.random() * TILE_COUNT)
        };

    } while (
        snake.some(segment =>
            segment.x === food.x &&
            segment.y === food.y
        )
    );

}


// ============================================
// DRAW GAME
// ============================================

function drawGame() {

    // Clear canvas
    ctx.fillStyle = "#101426";
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    // Draw grid
    drawGrid();


    // Draw food
    ctx.fillStyle = "#ff5c7a";

    ctx.beginPath();

    ctx.arc(
        food.x * GRID_SIZE + GRID_SIZE / 2,
        food.y * GRID_SIZE + GRID_SIZE / 2,
        GRID_SIZE / 2 - 3,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Draw snake
    snake.forEach((segment, index) => {

        ctx.fillStyle = index === 0
            ? "#7c5cff"
            : "#5a42cc";

        ctx.fillRect(
            segment.x * GRID_SIZE + 2,
            segment.y * GRID_SIZE + 2,
            GRID_SIZE - 4,
            GRID_SIZE - 4
        );

    });

}


// ============================================
// DRAW GRID
// ============================================

function drawGrid() {

    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    ctx.lineWidth = 1;


    for (let i = 0; i <= TILE_COUNT; i++) {

        // Vertical lines
        ctx.beginPath();

        ctx.moveTo(i * GRID_SIZE, 0);

        ctx.lineTo(i * GRID_SIZE, canvas.height);

        ctx.stroke();


        // Horizontal lines
        ctx.beginPath();

        ctx.moveTo(0, i * GRID_SIZE);

        ctx.lineTo(canvas.width, i * GRID_SIZE);

        ctx.stroke();

    }

}


// ============================================
// GAME OVER
// ============================================

function endGame() {

    gameActive = false;

    clearInterval(gameLoop);

    gameLoop = null;


    const gameStatus = document.getElementById("game-status");

    gameStatus.textContent = `Game Over! Your score: ${score}`;


    drawGame();


    // Game over overlay
    ctx.fillStyle = "rgba(0,0,0,0.65)";

    ctx.fillRect(0, 0, canvas.width, canvas.height);


    ctx.fillStyle = "#ffffff";

    ctx.font = "bold 32px Arial";

    ctx.textAlign = "center";

    ctx.fillText(
        "GAME OVER",
        canvas.width / 2,
        canvas.height / 2 - 15
    );


    ctx.font = "20px Arial";

    ctx.fillText(
        `Score: ${score}`,
        canvas.width / 2,
        canvas.height / 2 + 25
    );

}


// ============================================
// CLEANUP GAME
// ============================================

export function cleanupSnake() {

    gameActive = false;

    clearInterval(gameLoop);

    gameLoop = null;


    window.removeEventListener("keydown", handleKeyPress);


    snake = [];

    score = 0;

    food = {};

    canvas = null;

    ctx = null;

}