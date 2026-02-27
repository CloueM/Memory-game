export const LEADERBOARD_KEY = 'matchamoji-leaderboard';
export const MAX_SCORES = 5;

// Retrieve leaderboard from localStorage
export function getLeaderboard() {
    var stored = localStorage.getItem(LEADERBOARD_KEY);
    if (stored) {
        return JSON.parse(stored);
    }
    return [];
}

// Save a new score to the leaderboard
export function saveScore(score, difficulty, timeStr) {
    var leaderboard = getLeaderboard();
    
    // Create new score entry
    var newEntry = {
        score: score,
        difficulty: difficulty,
        date: new Date().toLocaleDateString(),
        time: timeStr
    };
    
    // Add to list and sort descending by score
    leaderboard.push(newEntry);
    leaderboard.sort(function(a, b) {
        return b.score - a.score;
    });
    
    // Keep only top 3
    if (leaderboard.length > MAX_SCORES) {
        leaderboard.slice(0, MAX_SCORES);
        leaderboard = leaderboard.slice(0, MAX_SCORES);
    }
    
    // Save back to localStorage
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard));
    
    return leaderboard;
}
