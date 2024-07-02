export function getTimeFromDuration(durationStr) {
    let [hoursStr, minutesStr] = durationStr.split(':');

    let hours = parseInt(hoursStr, 10);
    let minutes = parseInt(minutesStr, 10);

    if (hours >= 24 && hours % 24 === 0) {
        let days = hours / 24;
        if (days % 30 === 0) {
            let months = days / 30;
            return `${months}m`;
        } else {
            return `${days}d`;
        }
    } else if (hours >= 168 && hours % 168 === 0) {
        let weeks = hours / 168;
        return `${weeks}w`;
    } else {
        return `${hours}h`;
    }
}