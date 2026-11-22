// ============================================
// MINI GAMES HUB
// ROCK PAPER SCISSORS
// ============================================


// ============================================
// GAME VARIABLES
// ============================================

let playerScore = 0;
let computerScore = 0;
let draws = 0;

let gameActive = true;


// Available choices
const CHOICES = ["rock", "paper", "scissors"];


// Choice emojis
const CHOICE_EMOJIS = {
    rock: "✊",
    paper: "✋",
    scissors: "✌️"
};


// ============================================
// INITIALIZE GAME
// ============================================

export function initializeRockPaperScissors() {

    const gameStage = document.getElementById("game-stage");
    const gameStatus = document.getElementById("game-status");

    // Reset game
    playerScore = 0;
    computerScore = 0;
    draws = 0;
    gameActive = true;

    // Create game interface
    gameStage.innerHTML = `

        <div class="rps-container">

            <div class="rps-scoreboard">

                <div class="rps-score">
                    <span class="rps-score-label">YOU</span>
                    <span id="rps-player-score">0</span>
                </div>

                <div class="rps-score">
                    <span class="rps-score-label">DRAWS</span>
                    <span id="rps-draws">0</span>
                </div>

                <div class="rps-score">
                    <span class="rps-score-label">COMPUTER</span>
                    <span id="rps-computer-score">0</span>
                </div>

            </div>


            <div class="rps-battle-area">

                <div class="rps-player">

                    <h3>YOU</h3>

                    <div class="rps-choice-display" id="rps-player-choice">
                        ?
                    </div>

                </div>


                <div class="rps-vs">
                    VS
                </div>


                <div class="rps-player">

                    <h3>COMPUTER</h3>

                    <div class="rps-choice-display" id="rps-computer-choice">
                        ?
                    </div>

                </div>

            </div>


            <h3 class="rps-choose-heading">
                CHOOSE YOUR MOVE
            </h3>


            <div class="rps-buttons">

                <button class="rps-choice-btn" data-choice="rock">
                    <span>✊</span>
                    <span>ROCK</span>
                </button>

                <button class="rps-choice-btn" data-choice="paper">
                    <span>✋</span>
                    <span>PAPER</span>
                </button>

                <button class="rps-choice-btn" data-choice="scissors">
                    <span>✌️</span>
                    <span>SCISSORS</span>
                </button>

            </div>


            <div class="rps-round-result" id="rps-round-result">
                Make your move!
            </div>

        </div>

    `;


    gameStatus.textContent = "Choose Rock, Paper, or Scissors!";


    // Attach button events
    const choiceButtons = document.querySelectorAll(".rps-choice-btn");

    choiceButtons.forEach(button => {

        button.addEventListener("click", () => {

            playRound(button.dataset.choice);

        });

    });

}


// ============================================
// PLAY ROUND
// ============================================

function playRound(playerChoice) {

    if (!gameActive) return;


    // Computer chooses randomly
    const computerChoice =
        CHOICES[Math.floor(Math.random() * CHOICES.length)];


    // Display choices
    document.getElementById("rps-player-choice").textContent =
        CHOICE_EMOJIS[playerChoice];

    document.getElementById("rps-computer-choice").textContent =
        CHOICE_EMOJIS[computerChoice];


    // Determine result
    let result = "";


    if (playerChoice === computerChoice) {

        result = "draw";
        draws++;

    }

    else if (

        (playerChoice === "rock" && computerChoice === "scissors") ||
        (playerChoice === "paper" && computerChoice === "rock") ||
        (playerChoice === "scissors" && computerChoice === "paper")

    ) {

        result = "win";
        playerScore++;

    }

    else {

        result = "lose";
        computerScore++;

    }


    // Update scoreboard
    updateScoreboard();


    // Display round result
    displayRoundResult(result, playerChoice, computerChoice);

}


// ============================================
// UPDATE SCOREBOARD
// ============================================

function updateScoreboard() {

    document.getElementById("rps-player-score").textContent =
        playerScore;

    document.getElementById("rps-computer-score").textContent =
        computerScore;

    document.getElementById("rps-draws").textContent =
        draws;

}


// ============================================
// DISPLAY ROUND RESULT
// ============================================

function displayRoundResult(result, playerChoice, computerChoice) {

    const resultElement =
        document.getElementById("rps-round-result");

    const gameStatus =
        document.getElementById("game-status");


    if (result === "win") {

        resultElement.textContent = "🎉 You Win This Round!";

        resultElement.className =
            "rps-round-result result-win";

        gameStatus.textContent =
            `${CHOICE_EMOJIS[playerChoice]} beats ${CHOICE_EMOJIS[computerChoice]}! You win!`;

    }

    else if (result === "lose") {

        resultElement.textContent = "😔 Computer Wins This Round!";

        resultElement.className =
            "rps-round-result result-lose";

        gameStatus.textContent =
            `${CHOICE_EMOJIS[computerChoice]} beats ${CHOICE_EMOJIS[playerChoice]}. You lose!`;

    }

    else {

        resultElement.textContent = "🤝 It's a Draw!";

        resultElement.className =
            "rps-round-result result-draw";

        gameStatus.textContent =
            "Both selected the same move!";

    }

}


// ============================================
// CLEANUP GAME
// ============================================

export function cleanupRockPaperScissors() {

    gameActive = false;

    playerScore = 0;
    computerScore = 0;
    draws = 0;

}