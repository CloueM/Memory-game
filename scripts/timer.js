import { gameState, dom, MAX_TIME } from './state.js';
import { playTickingSfx, stopTickingSfx, playCountdownSfx } from './audio.js';

// update visual
export function updateTimerDisplay() {
    // chill mode check
    if (gameState.currentDifficulty === 'chill') {
        dom.timerBar.style.width = '100%';
        dom.timerBar.style.backgroundColor = '#48bb78';
        return;
    }

    // math vars
    var timeLeft = gameState.timeLeft;
    var max = MAX_TIME;
    
    // width calc
    var percentage = (timeLeft / max) * 100;
    dom.timerBar.style.width = percentage + '%';
    
    // color calc (green to red)
    var hue = (percentage / 100) * 120;
    dom.timerBar.style.backgroundColor = 'hsl(' + hue + ', 70%, 50%)';
}

// glow effect
export function triggerGlow(type) {
    dom.timerContainer.classList.remove('glow-green');
    dom.timerContainer.classList.remove('glow-red');
    
    // reset animation hack
    void dom.timerContainer.offsetWidth;
    
    var className = 'glow-' + type;
    dom.timerContainer.classList.add(className);
    
    // cleanup glow
    setTimeout(function() {
        dom.timerContainer.classList.remove(className);
    }, 500);
}

// start timer
export function startTimer(seconds, onGameOver) {
    gameState.timeLeft = seconds;
    updateTimerDisplay();
    
    // reset interval
    clearInterval(gameState.timerInterval);
    
    // tick every second
    gameState.timerInterval = setInterval(function() {
        gameState.timeLeft = gameState.timeLeft - 1;
        updateTimerDisplay();
        
        // tick sound check
        if (gameState.timeLeft <= 10) {
            if (gameState.timeLeft > 0) {
                playTickingSfx();
            }
        } else {
            stopTickingSfx();
        }
        
        // time up check
        if (gameState.timeLeft <= 0) {
            clearInterval(gameState.timerInterval);
            stopTickingSfx();
            
            if (onGameOver) {
                onGameOver();
            }
        }
    }, 1000);
}

// countdown logic
export function startCountdown(onComplete) {
    // show overlay
    dom.countdownOverlay.classList.remove('hidden');
    dom.countdownOverlay.style.opacity = '1';
    
    var count = 5;
    dom.countdownNumber.textContent = count;
    playCountdownSfx();
    
    // reset animation
    dom.countdownNumber.style.animation = 'none';
    dom.countdownNumber.offsetHeight;
    dom.countdownNumber.style.animation = 'popIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards';

    // countdown interval
    var interval = setInterval(function() {
        count = count - 1;
        
        if (count > 0) {
            // update number
            dom.countdownNumber.textContent = count;
            playCountdownSfx();
            
            dom.countdownNumber.style.animation = 'none';
            dom.countdownNumber.offsetHeight;
            dom.countdownNumber.style.animation = 'popIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards';
        } else if (count === 0) {
            // start text
            dom.countdownNumber.textContent = 'Start!';
            
            dom.countdownNumber.style.animation = 'none';
            dom.countdownNumber.offsetHeight;
            dom.countdownNumber.style.animation = 'popIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards';
        } else {
            clearInterval(interval);
            
            // cleanup and start game
            dom.countdownOverlay.style.opacity = '0';
            
            setTimeout(function() {
                dom.countdownOverlay.classList.add('hidden');
                gameState.isProcessing = false;
                
                if (onComplete) {
                    onComplete();
                }
            }, 500);
        }
    }, 1000);
}
