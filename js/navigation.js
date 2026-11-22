// ==========================================
// MINI GAMES HUB - NAVIGATION
// ==========================================

export function initializeNavigation() {

    // HTML ELEMENTS
    const mainContent = document.getElementById("main-content");
    const footer = document.querySelector(".footer");
    const gameView = document.getElementById("game-view");

    const navLinks = document.querySelectorAll(".nav-link");
    const homeLogo = document.getElementById("home-logo");
    const exploreButton = document.getElementById("explore-btn");

    const backHomeButton = document.getElementById("back-home-btn");
    const gameHomeButton = document.getElementById("game-home-btn");

    const gameButtons = document.querySelectorAll("[data-game]");

    const menuToggle = document.getElementById("menu-toggle");
    const navMenu = document.getElementById("nav-menu");


    // ==========================================
    // NAVIGATE TO HOMEPAGE SECTION
    // ==========================================

    function navigateToSection(sectionName) {

        const section = document.getElementById(sectionName);

        if (!section) return;

        navMenu?.classList.remove("active");

        navLinks.forEach(link => {
            link.classList.remove("active");

            if (link.dataset.section === sectionName) {
                link.classList.add("active");
            }
        });

        section.scrollIntoView({
            behavior: "smooth"
        });
    }


    // ==========================================
    // RETURN TO HOME
    // ==========================================

    function goToHome() {

        // Notify main.js to unload the current game
        window.dispatchEvent(new Event("returnHome"));

        // Show homepage
        mainContent.style.display = "";
        footer.style.display = "";

        // Hide game screen
        gameView.classList.remove("active");
        gameView.hidden = true;

        // Update navigation
        navLinks.forEach(link => {
            link.classList.remove("active");
        });

        const homeLink = document.querySelector('[data-section="home"]');

        if (homeLink) {
            homeLink.classList.add("active");
        }

        // Restore browser tab title
        document.title = "Mini Games Hub | Your Playground";

        // Scroll to top
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }


    // ==========================================
    // OPEN GAME
    // ==========================================

    function openGame(gameName) {

        const games = {

            "tic-tac-toe": {
                title: "Tic-Tac-Toe",
                category: "Strategy",
                description: "Challenge a friend in this classic two-player game."
            },

            "rock-paper-scissors": {
                title: "Rock Paper Scissors",
                category: "Casual",
                description: "Choose your move and see if you can beat the computer."
            },

            "memory": {
                title: "Memory Match",
                category: "Puzzle",
                description: "Flip cards and match identical pairs."
            },

            "snake": {
                title: "Snake",
                category: "Arcade",
                description: "Eat food, grow longer, and avoid hitting yourself."
            },

            "pong": {
                title: "Pong",
                category: "Arcade",
                description: "Keep the ball in play and beat your opponent."
            }

        };


        const selectedGame = games[gameName];

        if (!selectedGame) {
            console.error("Invalid game ID:", gameName);
            return;
        }


        // Update game information
        document.getElementById("game-title").textContent =
            selectedGame.title;

        document.getElementById("game-category").textContent =
            selectedGame.category;

        document.getElementById("game-description").textContent =
            selectedGame.description;

        document.getElementById("game-status").textContent =
            "Game ready!";


        // Clear previous game
        document.getElementById("game-stage").innerHTML = "";


        // Hide homepage
        mainContent.style.display = "none";
        footer.style.display = "none";


        // IMPORTANT: Remove hidden attribute
        gameView.hidden = false;

        // Activate game screen
        gameView.classList.add("active");


        // Update browser tab title
        document.title = `${selectedGame.title} | Mini Games Hub`;


        // Scroll to top
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });


        // Notify main.js
        window.dispatchEvent(
            new CustomEvent("gameSelected", {
                detail: {
                    gameName: gameName
                }
            })
        );

    }


    // ==========================================
    // NAVIGATION EVENTS
    // ==========================================

    navLinks.forEach(link => {

        link.addEventListener("click", function(event) {

            event.preventDefault();

            navigateToSection(this.dataset.section);

        });

    });


    // Logo click
    if (homeLogo) {

        homeLogo.addEventListener("click", function(event) {

            event.preventDefault();

            goToHome();

        });

    }


    // Explore Games
    if (exploreButton) {

        exploreButton.addEventListener("click", function() {

            navigateToSection("games");

        });

    }


    // Game buttons
    gameButtons.forEach(button => {

        button.addEventListener("click", function() {

            openGame(this.dataset.game);

        });

    });


    // Back buttons
    backHomeButton?.addEventListener("click", goToHome);
    gameHomeButton?.addEventListener("click", goToHome);


    // ==========================================
    // MOBILE MENU
    // ==========================================

    menuToggle?.addEventListener("click", function() {

        navMenu?.classList.toggle("active");

    });


    document.addEventListener("click", function(event) {

        if (
            navMenu &&
            menuToggle &&
            !navMenu.contains(event.target) &&
            !menuToggle.contains(event.target)
        ) {
            navMenu.classList.remove("active");
        }

    });


    // ==========================================
    // FOOTER LINKS
    // ==========================================

    document.querySelectorAll(".footer-links a").forEach(link => {

        link.addEventListener("click", function(event) {

            event.preventDefault();

            const sectionName = this.getAttribute("href").replace("#", "");

            navigateToSection(sectionName);

        });

    });


    // ==========================================
    // INITIAL STATE
    // ==========================================

    gameView.classList.remove("active");
    gameView.hidden = true;

    navLinks.forEach(link => link.classList.remove("active"));

    document.querySelector('[data-section="home"]')?.classList.add("active");

}