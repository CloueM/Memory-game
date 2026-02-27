import { gameState, dom, DIFFICULTIES } from './state.js';
import { toggleMute, updateMuteIcons, playMusic, startMusic, playHoverSfx, playSelectSfx, stopTickingSfx } from './audio.js';
import { startCountdown, startTimer } from './timer.js';
import { initGame, gameOver } from './game.js';
import { getLeaderboard } from './storage.js';

// start music and setup icons
startMusic();
updateMuteIcons();

// mute buttons
dom.welcomeMuteBtn.addEventListener('click', toggleMute);
dom.gameMuteBtn.addEventListener('click', toggleMute);

// render leaderboard logic
export function renderLeaderboard() {
    var leaderboard = getLeaderboard();
    dom.leaderboardList.innerHTML = '';
    
    if (leaderboard.length === 0) {
        dom.leaderboardList.innerHTML = '<li>Play a game to set a high score!</li>';
        return;
    }
    
    for (var i = 0; i < leaderboard.length; i++) {
        var entry = leaderboard[i];
        var li = document.createElement('li');
        
        // Example output: "1. 3500 pts - Medium (30s)"
        li.innerHTML = `
            <span class="rank">#${i + 1}</span>
            <span class="score">${entry.score}</span>
            <span class="diff ${entry.difficulty}">${entry.difficulty}</span>
        `;
        dom.leaderboardList.appendChild(li);
    }
}

// render on load
renderLeaderboard();

// helper to add sounds to buttons
function addButtonSounds(btn) {
    btn.addEventListener('mouseenter', playHoverSfx);
    btn.addEventListener('click', playSelectSfx);
}

// add sounds to all buttons
var allButtons = document.querySelectorAll('button');

for (var i = 0; i < allButtons.length; i++) {
    var btn = allButtons[i];
    addButtonSounds(btn);
}

// handle difficulty selection
function handleDifficultyClick() {
    var level = this.dataset.level;
    
    // switch screens
    dom.welcomeScreen.classList.add('hidden');
    dom.gameContainer.classList.remove('hidden');
    
    playMusic();
    initGame(level);
    
    // start game with countdown
    startCountdown(function() {
        var difficultySettings = DIFFICULTIES[level];
        if (difficultySettings.startTime) {
            startTimer(difficultySettings.startTime, gameOver);
        }
    });
}

// difficulty buttons
var diffButtons = document.querySelectorAll('.diff-btn');

for (var i = 0; i < diffButtons.length; i++) {
    var btn = diffButtons[i];
    btn.addEventListener('click', handleDifficultyClick);
}

// handle play again
function handlePlayAgainClick() {
    // hide modals
    dom.winMessage.classList.add('hidden');
    dom.gameOverMessage.classList.add('hidden');
    
    initGame(gameState.currentDifficulty);
    
    startCountdown(function() {
        var difficultySettings = DIFFICULTIES[gameState.currentDifficulty];
        if (difficultySettings.startTime) {
            startTimer(difficultySettings.startTime, gameOver);
        }
    });
}

// play again buttons
var playAgainButtons = document.querySelectorAll('.play-again-btn');

for (var i = 0; i < playAgainButtons.length; i++) {
    var btn = playAgainButtons[i];
    btn.addEventListener('click', handlePlayAgainClick);
}

// handle main menu return
function handleMainMenuClick() {
    // hide everything and show welcome screen
    dom.winMessage.classList.add('hidden');
    dom.gameOverMessage.classList.add('hidden');
    dom.gameContainer.classList.add('hidden');
    dom.welcomeScreen.classList.remove('hidden');
}

// main menu buttons
var mainMenuButtons = document.querySelectorAll('.main-menu-btn');

for (var i = 0; i < mainMenuButtons.length; i++) {
    var btn = mainMenuButtons[i];
    btn.addEventListener('click', handleMainMenuClick);
}

// handle in-game restart
function handleRestartClick() {
    initGame(gameState.currentDifficulty);
    
    startCountdown(function() {
        var difficultySettings = DIFFICULTIES[gameState.currentDifficulty];
        if (difficultySettings.startTime) {
            startTimer(difficultySettings.startTime, gameOver);
        }
    });
}

dom.restartBtn.addEventListener('click', handleRestartClick);

// handle in-game main menu
function handleGameMenuClick() {
    clearInterval(gameState.timerInterval);
    stopTickingSfx();
    
    dom.gameContainer.classList.add('hidden');
    dom.welcomeScreen.classList.remove('hidden');
}

var gameMenuBtn = document.getElementById('main-menu-game-btn');
gameMenuBtn.addEventListener('click', handleGameMenuClick);

// toggle score explanation
function toggleScoreExplanation() {
    dom.scoreExplanation.classList.toggle('hidden');
    
    var isHidden = dom.scoreExplanation.classList.contains('hidden');
    
    if (isHidden) {
        dom.scoreExplainBtn.textContent = 'How is this calculated? ▼';
    } else {
        dom.scoreExplainBtn.textContent = 'Hide explanation ▲';
    }
}

dom.scoreExplainBtn.addEventListener('click', toggleScoreExplanation);
