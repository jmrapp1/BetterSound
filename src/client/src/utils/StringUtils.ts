export function formatTimeString(secs) {
    let timeStr = new Date(secs * 1000).toISOString().substr(11, 8);
    if (timeStr.startsWith('00:')) {
        timeStr = timeStr.substring(3);
    }
    if (timeStr.startsWith('0')) {
        timeStr = timeStr.substring(1);
    }
    return timeStr;
}
