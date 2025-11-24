import { gameState, dom } from './state.js';

const audioElements = {
    bgMusic: document.getElementById('bg-music'),
    bgForest: document.getElementById('bg-forest'),
    hoverSfx: document.getElementById('hover-sfx'),
    selectSfx: document.getElementById('select-sfx'),
    countdownSfx: document.getElementById('countdown-sfx'),
    cardHoverSfx: document.getElementById('card-hover-sfx'),
    cardFlipSfx: document.getElementById('card-flip-sfx'),
    matchSfx: document.getElementById('match-sfx'),
    notMatchSfx: document.getElementById('not-match-sfx'),
    gameOverSfx: document.getElementById('game-over-sfx'),
    gameWonSfx: document.getElementById('game-won-sfx'),
    clockTickingSfx: document.getElementById('clock-ticking-sfx')
};

// Set initial volume
audioElements.bgMusic.volume = 0.2;

export function toggleMute() {
    gameState.isMuted = !gameState.isMuted;
    audioElements.bgMusic.muted = gameState.isMuted;
    audioElements.bgForest.muted = gameState.isMuted;
    
    if (gameState.isMuted) {
        stopTickingSfx();
    }
    // Note: The logic to resume ticking if unmuted is handled by the timer loop in timer.js

    updateMuteIcons();
    
    // If unmuting and paused, try to play
    if (!gameState.isMuted && audioElements.bgMusic.paused) {
        playMusic();
    }
}

export function updateMuteIcons() {
    const icon = gameState.isMuted ? '🔇' : '🔊';
    dom.welcomeMuteBtn.textContent = icon;
    dom.gameMuteBtn.textContent = icon;
}

export function playMusic() {
    if (!gameState.isMuted) {
        audioElements.bgMusic.play().catch(e => console.log("Bg music play failed:", e));
        audioElements.bgForest.play().catch(e => console.log("Forest sfx play failed:", e));
    }
}

export function startMusic() {
    if (!gameState.isMuted && audioElements.bgMusic.paused) {
        Promise.all([audioElements.bgMusic.play(), audioElements.bgForest.play()]).then(() => {
            document.removeEventListener('click', startMusic);
            document.removeEventListener('keydown', startMusic);
        }).catch(() => {
            document.addEventListener('click', startMusic, { once: true });
            document.addEventListener('keydown', startMusic, { once: true });
        });
    }
}

export function playHoverSfx() {
    if (!gameState.isMuted) {
        audioElements.hoverSfx.currentTime = 0;
        audioElements.hoverSfx.play().catch(() => {});
    }
}

export function playSelectSfx() {
    if (!gameState.isMuted) {
        audioElements.selectSfx.currentTime = 0;
        audioElements.selectSfx.play().catch(() => {});
    }
}

export function playCountdownSfx() {
    if (!gameState.isMuted) {
        audioElements.countdownSfx.currentTime = 0;
        audioElements.countdownSfx.play().catch(() => {});
    }
}

export function playCardHoverSfx() {
    if (!gameState.isMuted) {
        audioElements.cardHoverSfx.currentTime = 0;
        audioElements.cardHoverSfx.volume = 0.2;
        audioElements.cardHoverSfx.play().catch(() => {});
    }
}

export function playCardFlipSfx() {
    if (!gameState.isMuted) {
        audioElements.cardFlipSfx.currentTime = 0;
        audioElements.cardFlipSfx.play().catch(() => {});
    }
}

export function playMatchSfx() {
    if (!gameState.isMuted) {
        audioElements.matchSfx.currentTime = 0;
        audioElements.matchSfx.play().catch(() => {});
    }
}

export function playNotMatchSfx() {
    if (!gameState.isMuted) {
        audioElements.notMatchSfx.currentTime = 0;
        audioElements.notMatchSfx.play().catch(() => {});
    }
}

export function playGameOverSfx() {
    if (!gameState.isMuted) {
        audioElements.gameOverSfx.currentTime = 0;
        audioElements.gameOverSfx.play().catch(() => {});
    }
}

export function playGameWonSfx() {
    if (!gameState.isMuted) {
        audioElements.gameWonSfx.currentTime = 0;
        audioElements.gameWonSfx.play().catch(() => {});
    }
}

export function playTickingSfx() {
    if (!gameState.isMuted && audioElements.clockTickingSfx.paused) {
        audioElements.clockTickingSfx.play().catch(() => {});
    }
}

export function stopTickingSfx() {
    audioElements.clockTickingSfx.pause();
    audioElements.clockTickingSfx.currentTime = 0;
}
