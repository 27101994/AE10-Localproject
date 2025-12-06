/**
 * Generate a random room code for buddy training
 * @returns {string} 6-character alphanumeric code
 */
export function generateRoomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude similar looking chars
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

/**
 * Generate a live view code
 * @returns {string} 6-character alphanumeric code
 */
export function generateLiveViewCode() {
    return generateRoomCode();
}

/**
 * Validate a room/view code format
 * @param {string} code
 * @returns {boolean}
 */
export function isValidCode(code) {
    return /^[A-Z0-9]{6}$/.test(code);
}
