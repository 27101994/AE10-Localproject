/**
 * Calculate the direction arrow from shot coordinates relative to center
 * Returns one of 8 directional arrows: ↑, ↗, →, ↘, ↓, ↙, ←, ↖
 */
export function calculateDirection(x, y, centerX = 0, centerY = 0) {
    const dx = x - centerX;
    const dy = y - centerY;

    // Calculate angle in degrees (0° is right, 90° is up)
    let angle = Math.atan2(-dy, dx) * (180 / Math.PI);

    // Normalize to 0-360
    if (angle < 0) angle += 360;

    // Map to 8 directions
    if (angle >= 337.5 || angle < 22.5) return '→';
    if (angle >= 22.5 && angle < 67.5) return '↗';
    if (angle >= 67.5 && angle < 112.5) return '↑';
    if (angle >= 112.5 && angle < 157.5) return '↖';
    if (angle >= 157.5 && angle < 202.5) return '←';
    if (angle >= 202.5 && angle < 247.5) return '↙';
    if (angle >= 247.5 && angle < 292.5) return '↓';
    if (angle >= 292.5 && angle < 337.5) return '↘';

    return '→';
}

/**
 * Calculate score based on distance from center
 * Target zones: 10x (center), 10, 9, 8, etc.
 */
export function calculateScore(x, y, centerX = 0, centerY = 0) {
    const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));

    // These are approximate values - adjust based on actual target dimensions
    // Assuming target radius of 100 units
    if (distance <= 5) return { score: 10, decimal: 10.9, is10x: true };
    if (distance <= 15) return { score: 10, decimal: 10.5, is10x: false };
    if (distance <= 30) return { score: 9, decimal: 9.5, is10x: false };
    if (distance <= 45) return { score: 8, decimal: 8.5, is10x: false };
    if (distance <= 60) return { score: 7, decimal: 7.5, is10x: false };
    if (distance <= 75) return { score: 6, decimal: 6.5, is10x: false };

    return { score: 0, decimal: 0, is10x: false };
}

/**
 * Calculate group radius from multiple shots
 */
export function calculateGroupRadius(shots) {
    if (shots.length < 2) return 0;

    // Calculate center of group
    const centerX = shots.reduce((sum, shot) => sum + shot.x, 0) / shots.length;
    const centerY = shots.reduce((sum, shot) => sum + shot.y, 0) / shots.length;

    // Find maximum distance from group center
    const maxDistance = Math.max(...shots.map(shot =>
        Math.sqrt(Math.pow(shot.x - centerX, 2) + Math.pow(shot.y - centerY, 2))
    ));

    return maxDistance.toFixed(2);
}

/**
 * Calculate group center from multiple shots
 */
export function calculateGroupCenter(shots) {
    if (shots.length === 0) return { x: 0, y: 0 };

    const centerX = shots.reduce((sum, shot) => sum + shot.x, 0) / shots.length;
    const centerY = shots.reduce((sum, shot) => sum + shot.y, 0) / shots.length;

    return { x: centerX, y: centerY };
}

/**
 * Format time from milliseconds to MM:SS
 */
export function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/**
 * Generate dummy shot data for testing
 */
export function generateDummyShot(shotNumber) {
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * 40; // Random distance from center

    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    const scoreData = calculateScore(x, y);
    const direction = calculateDirection(x, y);

    return {
        number: shotNumber,
        x,
        y,
        score: scoreData.score,
        scoreDecimal: scoreData.decimal,
        direction,
        is10x: scoreData.is10x,
    };
}
