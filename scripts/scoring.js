import { gameState, dom, MAX_TIME, DIFFICULTIES } from './state.js';
import { playGameWonSfx } from './audio.js';
import { saveScore } from './storage.js';
import { renderLeaderboard } from './main.js';

// calculating the score
export function calculateScore() {
    // save state to variables
    var right = gameState.rightMoves;
    var wrong = gameState.wrongMoves;
    var currentDiff = gameState.currentDifficulty;
    var timeLeft = gameState.timeLeft;
    
    // total moves
    var totalMoves = right + wrong;
    
    // accuracy calculation
    var accuracy = 0;
    if (totalMoves > 0) {
        accuracy = (right / totalMoves) * 100;
    }
    
    // time calculation
    var timeFactor = 100;
    if (currentDiff !== 'chill') {
        timeFactor = (timeLeft / MAX_TIME) * 100;
    }
    
    // weights
    var accuracyWeight = 0.6;
    var timeWeight = 0.4;
    
    var accuracyPart = accuracy * accuracyWeight;
    var timePart = timeFactor * timeWeight;
    
    // base score
    var baseScore = accuracyPart + timePart;
    
    // difficulty multiplier
    var diffSettings = DIFFICULTIES[currentDiff];
    var multiplier = diffSettings.multiplier;
    
    // final calculation
    var finalScore = baseScore * multiplier;
    var roundedScore = Math.round(finalScore);
    
    return roundedScore;
}

// show the win screen
export function showWinMessage() {
    playGameWonSfx();
    
    // save state to variables
    var right = gameState.rightMoves;
    var wrong = gameState.wrongMoves;
    var currentDiff = gameState.currentDifficulty;
    var timeLeft = gameState.timeLeft;
    
    // stats
    var totalMoves = right + wrong;
    
    var accuracy = 0;
    if (totalMoves > 0) {
        accuracy = (right / totalMoves) * 100;
    }
    
    var timeFactor = 100;
    if (currentDiff !== 'chill') {
        timeFactor = (timeLeft / MAX_TIME) * 100;
    }
    
    // get score
    var score = calculateScore();
    
    // update screen text
    dom.finalScore.textContent = score;
    dom.finalRight.textContent = right;
    dom.finalWrong.textContent = wrong;
    
    // time display
    if (currentDiff === 'chill') {
        dom.finalTime.textContent = '∞';
    } else {
        dom.finalTime.textContent = timeLeft;
    }
    
    // multiplier display
    var diffSettings = DIFFICULTIES[currentDiff];
    var multiplier = diffSettings.multiplier;
    dom.finalMultiplier.textContent = multiplier + 'x';
    
    // formula explanation
    var accuracyWeight = 0.6;
    var timeWeight = 0.4;
    
    var accuracyMath = Math.round(accuracy * accuracyWeight);
    var timeMath = Math.round(timeFactor * timeWeight);
    
    var timeLeftText = timeLeft;
    if (currentDiff === 'chill') {
        timeLeftText = '∞';
    }
    
    var formulaText = '';
    formulaText = formulaText + 'Accuracy: (' + right + '/' + totalMoves + ') × 100 × ' + accuracyWeight + ' = ' + accuracyMath + '\n';
    formulaText = formulaText + 'Time: (' + timeLeftText + '/' + MAX_TIME + ') × 100 × ' + timeWeight + ' = ' + timeMath + '\n';
    formulaText = formulaText + 'Total: (' + accuracyMath + ' + ' + timeMath + ') × ' + multiplier + 'x = ' + score;
    
    dom.scoreFormula.innerText = formulaText;
    
    // save score to local storage
    var timeStr = '∞';
    if (currentDiff !== 'chill') {
        timeStr = (MAX_TIME - timeLeft) + 's';
    }
    saveScore(score, currentDiff, timeStr);
    
    // update leaderboard UI
    renderLeaderboard();
    
    // show modal
    dom.winMessage.classList.remove('hidden');
}
