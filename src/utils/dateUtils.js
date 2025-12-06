/**
 * Format a date for display
 * @param {string|Date} date
 * @returns {string}
 */
export function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Format a date for grouping (YYYY-MM-DD)
 * @param {string|Date} date
 * @returns {string}
 */
export function formatDateKey(date) {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
}

/**
 * Group items by date
 * @param {Array} items - Items with a date property
 * @param {string} dateField - Name of the date field
 * @returns {Object} Items grouped by formatted date
 */
export function groupByDate(items, dateField = 'savedAt') {
    const grouped = {};

    items.forEach(item => {
        const date = formatDate(item[dateField]);

        if (!grouped[date]) {
            grouped[date] = [];
        }
        grouped[date].push(item);
    });

    return grouped;
}

/**
 * Get relative time string (e.g., "2 hours ago")
 * @param {string|Date} date
 * @returns {string}
 */
export function getRelativeTime(date) {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now - past;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return 'just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return formatDate(date);
}
