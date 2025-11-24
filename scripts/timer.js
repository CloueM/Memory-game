import { gameState, dom, MAX_TIME } from './state.js';
import { playTickingSfx, stopTickingSfx, playCountdownSfx } from './audio.js';

export function updateTimerDisplay() {
    if (gameState.currentDifficulty === 'chill') {
        dom.timerBar.style.width = '100%';
        dom.timerBar.style.backgroundColor = '#48bb78';
        return;
    }

    const percentage = (gameState.timeLeft / MAX_TIME) * 100;
    
    dom.timerBar.style.width = `${percentage}%`;
    
    // Calculate Hue: 120 (Green) -> 0 (Red)
    const hue = (percentage / 100) * 120;
    dom.timerBar.style.backgroundColor = `hsl(${hue}, 70%, 50%)`;
}

export function triggerGlow(type) {
    dom.timerContainer.classList.remove('glow-green', 'glow-red');
    
    // Force reflow to restart animation if needed
    void dom.timerContainer.offsetWidth;
    
    dom.timerContainer.classList.add(`glow-${type}`);
    
    setTimeout(() => {
        dom.timerContainer.classList.remove(`glow-${type}`);
    }, 500);
}

export function startTimer(seconds, onGameOver) {
    gameState.timeLeft = seconds;
    updateTimerDisplay();
    
    clearInterval(gameState.timerInterval);
    gameState.timerInterval = setInterval(() => {
        gameState.timeLeft--;
        updateTimerDisplay();
        
        if (gameState.timeLeft <= 10 && gameState.timeLeft > 0) {
            playTickingSfx();
        } else {
            stopTickingSfx();
        }
        
        if (gameState.timeLeft <= 0) {
            clearInterval(gameState.timerInterval);
            stopTickingSfx();
            if (onGameOver) onGameOver();
        }
    }, 1000);
}

export function startCountdown(onComplete) {
    dom.countdownOverlay.classList.remove('hidden');
    dom.countdownOverlay.style.opacity = '1';
    let count = 5;
    dom.countdownNumber.textContent = count;
    playCountdownSfx();
    
    // Reset animation
    dom.countdownNumber.style.animation = 'none';
    dom.countdownNumber.offsetHeight; /* trigger reflow */
    dom.countdownNumber.style.animation = 'popIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards';

    const interval = setInterval(() => {
        count--;
        if (count > 0) {
            dom.countdownNumber.textContent = count;
            playCountdownSfx();
            // Reset animation
            dom.countdownNumber.style.animation = 'none';
            dom.countdownNumber.offsetHeight; /* trigger reflow */
            dom.countdownNumber.style.animation = 'popIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards';
        } else if (count === 0) {
            dom.countdownNumber.textContent = 'Start!';
            // Reset animation
            dom.countdownNumber.style.animation = 'none';
            dom.countdownNumber.offsetHeight; /* trigger reflow */
            dom.countdownNumber.style.animation = 'popIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards';
        } else {
            clearInterval(interval);
            
            // Fade out
            dom.countdownOverlay.style.opacity = '0';
            
            // Wait for transition to finish before hiding and starting game
            setTimeout(() => {
                dom.countdownOverlay.classList.add('hidden');
                gameState.isProcessing = false; // Enable clicks
                if (onComplete) onComplete();
            }, 500);
        }
    }, 1000);
}
