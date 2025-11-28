import { gameState, dom } from './state.js';

// grabbing all the audio elements
var audioElements = {
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

// start with full volume
audioElements.bgForest.volume = 1;

// toggle mute on/off
export function toggleMute() {
    // if autoplay was blocked, this button click should start the music
    if (gameState.isMuted === false) {
        if (audioElements.bgForest.paused === true) {
            playMusic();
            updateMuteIcons();
            return;
        }
    }

    // flip the mute variable
    if (gameState.isMuted === true) {
        gameState.isMuted = false;
    } else {
        gameState.isMuted = true;
    }

    // update the actual audio element
    audioElements.bgForest.muted = gameState.isMuted;
    
    // stop ticking if we muted
    if (gameState.isMuted === true) {
        stopTickingSfx();
    }

    updateMuteIcons();
    
    // if we unmuted, try playing music again
    if (gameState.isMuted === false) {
        if (audioElements.bgForest.paused === true) {
            playMusic();
        }
    }
}

// update the speaker icon
export function updateMuteIcons() {
    var icon;
    
    if (gameState.isMuted === true) {
        icon = '🔇';
    } else {
        icon = '🔊';
    }

    dom.welcomeMuteBtn.textContent = icon;
    dom.gameMuteBtn.textContent = icon;
}

// play the background music
export function playMusic() {
    if (gameState.isMuted === false) {
        var playPromise = audioElements.bgForest.play();
        
        if (playPromise !== undefined) {
            playPromise.catch(function(error) {
                console.log("Music play failed: " + error);
            });
        }
    }
}

// start music with a retry if autoplay fails
export function startMusic() {
    if (gameState.isMuted === false) {
        if (audioElements.bgForest.paused === true) {
            var musicPromise = audioElements.bgForest.play();

            if (musicPromise !== undefined) {
                musicPromise.catch(function() {
                    // if blocked, wait for a click to try again
                    function retry() {
                        startMusic();
                        document.removeEventListener('click', retry);
                        document.removeEventListener('keydown', retry);
                        document.removeEventListener('touchstart', retry);
                    }
                    
                    document.addEventListener('click', retry, { once: true });
                    document.addEventListener('keydown', retry, { once: true });
                    document.addEventListener('touchstart', retry, { once: true });
                });
            }
        }
    }
}

// sound effects functions
export function playHoverSfx() {
    if (gameState.isMuted === false) {
        audioElements.hoverSfx.currentTime = 0;
        audioElements.hoverSfx.play().catch(function() {});
    }
}

export function playSelectSfx() {
    if (gameState.isMuted === false) {
        audioElements.selectSfx.currentTime = 0;
        audioElements.selectSfx.play().catch(function() {});
    }
}

export function playCountdownSfx() {
    if (gameState.isMuted === false) {
        audioElements.countdownSfx.currentTime = 0;
        audioElements.countdownSfx.play().catch(function() {});
    }
}

export function playCardHoverSfx() {
    if (gameState.isMuted === false) {
        audioElements.cardHoverSfx.currentTime = 0;
        audioElements.cardHoverSfx.volume = 0.2;
        audioElements.cardHoverSfx.play().catch(function() {});
    }
}

export function playCardFlipSfx() {
    if (gameState.isMuted === false) {
        audioElements.cardFlipSfx.currentTime = 0;
        audioElements.cardFlipSfx.play().catch(function() {});
    }
}

export function playMatchSfx() {
    if (gameState.isMuted === false) {
        audioElements.matchSfx.currentTime = 0;
        audioElements.matchSfx.play().catch(function() {});
    }
}

export function playNotMatchSfx() {
    if (gameState.isMuted === false) {
        audioElements.notMatchSfx.currentTime = 0;
        audioElements.notMatchSfx.play().catch(function() {});
    }
}

export function playGameOverSfx() {
    if (gameState.isMuted === false) {
        audioElements.gameOverSfx.currentTime = 0;
        audioElements.gameOverSfx.play().catch(function() {});
    }
}

export function playGameWonSfx() {
    if (gameState.isMuted === false) {
        audioElements.gameWonSfx.currentTime = 0;
        audioElements.gameWonSfx.play().catch(function() {});
    }
}

export function playTickingSfx() {
    if (gameState.isMuted === false) {
        if (audioElements.clockTickingSfx.paused === true) {
            audioElements.clockTickingSfx.play().catch(function() {});
        }
    }
}

export function stopTickingSfx() {
    audioElements.clockTickingSfx.pause();
    audioElements.clockTickingSfx.currentTime = 0;
}
