// ============================================
// MINI GAMES HUB
// PONG GAME
// ============================================


// ============================================
// GAME VARIABLES
// ============================================

let canvas;
let ctx;

let animationFrame;

let playerScore = 0;
let computerScore = 0;

let gameActive = true;

let keys = {};

let ball;
let playerPaddle;
let computerPaddle;


// ============================================
// GAME SETTINGS
// ============================================

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;

const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 80;

const BALL_SIZE = 10;

// Slower initial ball speed
const INITIAL_BALL_SPEED = 3;

// Maximum ball speed
const MAX_BALL_SPEED = 5;

// Very gradual acceleration
const SPEED_INCREMENT = 0.15;

const WINNING_SCORE = 5;


// ============================================
// INITIALIZE GAME
// ============================================

export function initializePong() {

    playerScore = 0;
    computerScore = 0;

    gameActive = true;

    keys = {};

    const gameStage = document.getElementById("game-stage");

    gameStage.innerHTML = `
        <div class="pong-container">

            <div class="pong-scoreboard">

                <div class="pong-score">
                    <span class="pong-label">YOU</span>
                    <span id="player-score">0</span>
                </div>

                <div class="pong-divider">:</div>

                <div class="pong-score">
                    <span class="pong-label">COMPUTER</span>
                    <span id="computer-score">0</span>
                </div>

            </div>

            <canvas
                id="pong-canvas"
                width="${CANVAS_WIDTH}"
                height="${CANVAS_HEIGHT}">
            </canvas>

            <div class="pong-controls">
                <p>Move your paddle using <strong>W / S</strong> or <strong>↑ / ↓</strong></p>
            </div>

        </div>
    `;

    canvas = document.getElementById("pong-canvas");
    ctx = canvas.getContext("2d");

    createPaddles();

    resetBall();

    drawGame();

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    gameLoop();
}


// ============================================
// CREATE PADDLES
// ============================================

function createPaddles() {

    playerPaddle = {
        x: 20,
        y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
        width: PADDLE_WIDTH,
        height: PADDLE_HEIGHT,
        speed: 6
    };

    computerPaddle = {
        x: CANVAS_WIDTH - 20 - PADDLE_WIDTH,
        y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
        width: PADDLE_WIDTH,
        height: PADDLE_HEIGHT,
        speed: 3
    };
}


// ============================================
// RESET BALL
// ============================================

function resetBall(direction = 1) {

    ball = {
        x: CANVAS_WIDTH / 2 - BALL_SIZE / 2,
        y: CANVAS_HEIGHT / 2 - BALL_SIZE / 2,

        size: BALL_SIZE,

        speedX: INITIAL_BALL_SPEED * direction,

        speedY: (Math.random() * 2 - 1) * INITIAL_BALL_SPEED,

        maxSpeed: MAX_BALL_SPEED
    };

}


// ============================================
// KEYBOARD CONTROLS
// ============================================

function handleKeyDown(event) {

    const key = event.key.toLowerCase();

    // Prevent page scrolling when playing Pong
    if (
        key === "arrowup" ||
        key === "arrowdown" ||
        key === "arrowleft" ||
        key === "arrowright"
    ) {
        event.preventDefault();
    }

    keys[key] = true;

}


function handleKeyUp(event) {

    keys[event.key.toLowerCase()] = false;

}


// ============================================
// UPDATE GAME
// ============================================

function updateGame() {

    if (!gameActive) return;


    // ----------------------------------------
    // PLAYER MOVEMENT
    // ----------------------------------------

    if (keys["w"] || keys["arrowup"]) {

        playerPaddle.y -= playerPaddle.speed;

    }

    if (keys["s"] || keys["arrowdown"]) {

        playerPaddle.y += playerPaddle.speed;

    }


    // Keep player paddle inside canvas

    if (playerPaddle.y < 0) {

        playerPaddle.y = 0;

    }

    if (playerPaddle.y + playerPaddle.height > CANVAS_HEIGHT) {

        playerPaddle.y = CANVAS_HEIGHT - playerPaddle.height;

    }


    // ----------------------------------------
    // COMPUTER MOVEMENT
    // ----------------------------------------

    const computerCenter =
        computerPaddle.y + computerPaddle.height / 2;

    const ballCenter =
        ball.y + ball.size / 2;

    if (computerCenter < ballCenter - 15) {

        computerPaddle.y += computerPaddle.speed;

    }

    else if (computerCenter > ballCenter + 15) {

        computerPaddle.y -= computerPaddle.speed;

    }


    // Keep computer paddle inside canvas

    if (computerPaddle.y < 0) {

        computerPaddle.y = 0;

    }

    if (computerPaddle.y + computerPaddle.height > CANVAS_HEIGHT) {

        computerPaddle.y = CANVAS_HEIGHT - computerPaddle.height;

    }


    // ----------------------------------------
    // BALL MOVEMENT
    // ----------------------------------------

    ball.x += ball.speedX;
    ball.y += ball.speedY;


    // ----------------------------------------
    // WALL COLLISION
    // ----------------------------------------

    if (ball.y <= 0) {

        ball.y = 0;
        ball.speedY *= -1;

    }

    if (ball.y + ball.size >= CANVAS_HEIGHT) {

        ball.y = CANVAS_HEIGHT - ball.size;
        ball.speedY *= -1;

    }


    // ----------------------------------------
    // PLAYER PADDLE COLLISION
    // ----------------------------------------

    if (
        ball.x <= playerPaddle.x + playerPaddle.width &&
        ball.x + ball.size >= playerPaddle.x &&
        ball.y + ball.size >= playerPaddle.y &&
        ball.y <= playerPaddle.y + playerPaddle.height &&
        ball.speedX < 0
    ) {

        ball.x = playerPaddle.x + playerPaddle.width;

        ball.speedX = Math.abs(ball.speedX);

        graduallyIncreaseSpeed();

        adjustBallAngle(playerPaddle);

    }


    // ----------------------------------------
    // COMPUTER PADDLE COLLISION
    // ----------------------------------------

    if (
        ball.x + ball.size >= computerPaddle.x &&
        ball.x <= computerPaddle.x + computerPaddle.width &&
        ball.y + ball.size >= computerPaddle.y &&
        ball.y <= computerPaddle.y + computerPaddle.height &&
        ball.speedX > 0
    ) {

        ball.x = computerPaddle.x - ball.size;

        ball.speedX = -Math.abs(ball.speedX);

        graduallyIncreaseSpeed();

        adjustBallAngle(computerPaddle);

    }


    // ----------------------------------------
    // PLAYER SCORES
    // ----------------------------------------

    if (ball.x > CANVAS_WIDTH) {

        playerScore++;

        updateScore();

        if (checkWinner()) return;

        resetBall(1);

    }


    // ----------------------------------------
    // COMPUTER SCORES
    // ----------------------------------------

    if (ball.x + ball.size < 0) {

        computerScore++;

        updateScore();

        if (checkWinner()) return;

        resetBall(-1);

    }

}


// ============================================
// GRADUALLY INCREASE BALL SPEED
// ============================================

function graduallyIncreaseSpeed() {

    // Increase speedX gradually but never exceed maximum

    const direction = ball.speedX >= 0 ? 1 : -1;

    const currentSpeed = Math.abs(ball.speedX);

    const newSpeed = Math.min(
        currentSpeed + SPEED_INCREMENT,
        MAX_BALL_SPEED
    );

    ball.speedX = newSpeed * direction;


    // Gradually increase vertical speed too

    const verticalDirection = ball.speedY >= 0 ? 1 : -1;

    const verticalSpeed = Math.min(
        Math.abs(ball.speedY) + SPEED_INCREMENT,
        MAX_BALL_SPEED
    );

    ball.speedY = verticalSpeed * verticalDirection;

}


// ============================================
// ADJUST BALL ANGLE
// ============================================

function adjustBallAngle(paddle) {

    const paddleCenter =
        paddle.y + paddle.height / 2;

    const ballCenter =
        ball.y + ball.size / 2;

    const hitPosition =
        (ballCenter - paddleCenter) / (paddle.height / 2);

    // Keep angle reasonable

    const angle = hitPosition * 0.7;

    const speed = Math.sqrt(
        ball.speedX * ball.speedX +
        ball.speedY * ball.speedY
    );

    ball.speedY = speed * Math.sin(angle);

    ball.speedX = Math.sqrt(
        Math.max(0, speed * speed - ball.speedY * ball.speedY)
    ) * (ball.speedX >= 0 ? 1 : -1);

}


// ============================================
// UPDATE SCORE
// ============================================

function updateScore() {

    document.getElementById("player-score").textContent = playerScore;

    document.getElementById("computer-score").textContent = computerScore;

}


// ============================================
// CHECK WINNER
// ============================================

function checkWinner() {

    if (playerScore >= WINNING_SCORE) {

        gameActive = false;

        showGameOver("You Win! 🏆");

        return true;

    }

    if (computerScore >= WINNING_SCORE) {

        gameActive = false;

        showGameOver("Computer Wins! 🤖");

        return true;

    }

    return false;

}


// ============================================
// GAME OVER
// ============================================

function showGameOver(message) {

    const gameStage = document.getElementById("game-stage");

    const gameOverScreen = document.createElement("div");

    gameOverScreen.className = "pong-game-over";

    gameOverScreen.innerHTML = `
        <h2>${message}</h2>
        <p>Final Score: ${playerScore} - ${computerScore}</p>
    `;

    gameStage.appendChild(gameOverScreen);

}


// ============================================
// DRAW GAME
// ============================================

function drawGame() {

    if (!ctx) return;


    // Clear canvas

    ctx.clearRect(
        0,
        0,
        CANVAS_WIDTH,
        CANVAS_HEIGHT
    );


    // ----------------------------------------
    // CENTER LINE
    // ----------------------------------------

    ctx.setLineDash([8, 8]);

    ctx.strokeStyle = "rgba(255,255,255,0.25)";

    ctx.beginPath();

    ctx.moveTo(CANVAS_WIDTH / 2, 0);

    ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);

    ctx.stroke();

    ctx.setLineDash([]);


    // ----------------------------------------
    // PLAYER PADDLE
    // ----------------------------------------

    ctx.fillStyle = "#a855f7";

    ctx.fillRect(
        playerPaddle.x,
        playerPaddle.y,
        playerPaddle.width,
        playerPaddle.height
    );


    // ----------------------------------------
    // COMPUTER PADDLE
    // ----------------------------------------

    ctx.fillStyle = "#ffffff";

    ctx.fillRect(
        computerPaddle.x,
        computerPaddle.y,
        computerPaddle.width,
        computerPaddle.height
    );


    // ----------------------------------------
    // BALL
    // ----------------------------------------

    ctx.fillStyle = "#ffffff";

    ctx.fillRect(
        ball.x,
        ball.y,
        ball.size,
        ball.size
    );

}


// ============================================
// GAME LOOP
// ============================================

function gameLoop() {

    updateGame();

    drawGame();

    animationFrame = requestAnimationFrame(gameLoop);

}


// ============================================
// CLEANUP
// ============================================

export function cleanupPong() {

    gameActive = false;

    cancelAnimationFrame(animationFrame);

    document.removeEventListener("keydown", handleKeyDown);

    document.removeEventListener("keyup", handleKeyUp);

    canvas = null;
    ctx = null;

    ball = null;
    playerPaddle = null;
    computerPaddle = null;

    keys = {};

}