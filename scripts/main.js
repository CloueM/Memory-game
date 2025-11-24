import { gameState, dom, DIFFICULTIES } from './state.js';
import { toggleMute, updateMuteIcons, playMusic, startMusic, playHoverSfx, playSelectSfx, stopTickingSfx } from './audio.js';
import { startCountdown, startTimer } from './timer.js';
import { initGame, gameOver } from './game.js';

// Initialize audio state
startMusic();
updateMuteIcons();

// Event Listeners
dom.welcomeMuteBtn.addEventListener('click', toggleMute);
dom.gameMuteBtn.addEventListener('click', toggleMute);

// Attach SFX to all buttons
document.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('mouseenter', playHoverSfx);
    btn.addEventListener('click', playSelectSfx);
});

document.querySelectorAll('.diff-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const level = btn.dataset.level;
        dom.welcomeScreen.classList.add('hidden');
        dom.gameContainer.classList.remove('hidden');
        playMusic(); // Try to start music on interaction
        initGame(level);
        startCountdown(() => {
            if (DIFFICULTIES[level].startTime) {
                startTimer(DIFFICULTIES[level].startTime, gameOver);
            }
        });
    });
});

document.querySelectorAll('.play-again-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        dom.winMessage.classList.add('hidden');
        dom.gameOverMessage.classList.add('hidden');
        initGame(gameState.currentDifficulty);
        startCountdown(() => {
            if (DIFFICULTIES[gameState.currentDifficulty].startTime) {
                startTimer(DIFFICULTIES[gameState.currentDifficulty].startTime, gameOver);
            }
        });
    });
});

document.querySelectorAll('.main-menu-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        dom.winMessage.classList.add('hidden');
        dom.gameOverMessage.classList.add('hidden');
        dom.gameContainer.classList.add('hidden');
        dom.welcomeScreen.classList.remove('hidden');
    });
});

dom.restartBtn.addEventListener('click', () => {
    initGame(gameState.currentDifficulty);
    startCountdown(() => {
        if (DIFFICULTIES[gameState.currentDifficulty].startTime) {
            startTimer(DIFFICULTIES[gameState.currentDifficulty].startTime, gameOver);
        }
    });
});

document.getElementById('main-menu-game-btn').addEventListener('click', () => {
    clearInterval(gameState.timerInterval);
    stopTickingSfx();
    dom.gameContainer.classList.add('hidden');
    dom.welcomeScreen.classList.remove('hidden');
});

dom.scoreExplainBtn.addEventListener('click', () => {
    dom.scoreExplanation.classList.toggle('hidden');
    if (dom.scoreExplanation.classList.contains('hidden')) {
        dom.scoreExplainBtn.textContent = 'How is this calculated? ▼';
    } else {
        dom.scoreExplainBtn.textContent = 'Hide explanation ▲';
    }
});
