export function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount);
}
export function formatDate(dateString) {
    try {
        const d = new Date(dateString);
        return d.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    }
    catch {
        return dateString;
    }
}
export function formatTime(timeString) {
    // Convert "19:30" or "08:30:00" to "7:30 PM"
    if (!timeString)
        return '';
    const parts = timeString.split(':');
    if (parts.length < 2)
        return timeString;
    let hours = parseInt(parts[0], 10);
    const minutes = parts[1];
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
}
export function formatDistance(distanceKm) {
    if (distanceKm === null || distanceKm === undefined) {
        return 'Distance unavailable (set location)';
    }
    if (distanceKm < 1) {
        return `${Math.round(distanceKm * 1000)} meters away`;
    }
    return `${distanceKm.toFixed(1)} km away`;
}
