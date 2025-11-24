export const cardSymbols = ['🎮', '🎯', '🎨', '🎭', '🎪', '🎸'];

export const MAX_TIME = 60;

export const DIFFICULTIES = {
    chill: { startTime: null, modifier: 0, multiplier: 1 },
    easy: { startTime: 60, modifier: 2, multiplier: 1.2 },
    medium: { startTime: 45, modifier: 3, multiplier: 1.5 },
    hard: { startTime: 30, modifier: 4, multiplier: 2 },
    wth: { startTime: 15, modifier: 5, multiplier: 3 }
};

export const gameState = {
    cards: [],
    flippedCards: [],
    matchedPairs: 0,
    moves: 0,
    rightMoves: 0,
    wrongMoves: 0,
    isProcessing: false,
    timerInterval: null,
    timeLeft: 0,
    currentDifficulty: 'chill',
    isMuted: false
};

export const dom = {
    gameBoard: document.getElementById('game-board'),
    moveCount: document.getElementById('move-count'),
    rightCount: document.getElementById('right-count'),
    wrongCount: document.getElementById('wrong-count'),
    restartBtn: document.getElementById('restart-btn'),
    winMessage: document.getElementById('win-message'),
    gameOverMessage: document.getElementById('game-over-message'),
    finalMoves: document.getElementById('final-moves'),
    finalScore: document.getElementById('final-score'),
    welcomeScreen: document.getElementById('welcome-screen'),
    gameContainer: document.getElementById('game-container'),
    countdownOverlay: document.getElementById('countdown-overlay'),
    countdownNumber: document.querySelector('.countdown-number'),
    timerBar: document.getElementById('timer-bar'),
    timerContainer: document.querySelector('.timer-container'),
    welcomeMuteBtn: document.getElementById('welcome-mute-btn'),
    gameMuteBtn: document.getElementById('game-mute-btn'),
    finalRight: document.getElementById('final-right'),
    finalWrong: document.getElementById('final-wrong'),
    finalTime: document.getElementById('final-time'),
    finalMultiplier: document.getElementById('final-multiplier'),
    scoreFormula: document.getElementById('score-formula'),
    scoreExplainBtn: document.getElementById('score-explain-btn'),
    scoreExplanation: document.getElementById('score-explanation')
};
