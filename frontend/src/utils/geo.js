/**
 * Calculates the great-circle distance between two geographic coordinates
 * using the Haversine formula in kilometers.
 */
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
    if (lat1 === null || lat1 === undefined ||
        lon1 === null || lon1 === undefined ||
        lat2 === null || lat2 === undefined ||
        lon2 === null || lon2 === undefined) {
        return null;
    }
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return Math.round(d * 10) / 10; // Round to 1 decimal place (e.g. 2.4 km)
}
function toRad(degrees) {
    return (degrees * Math.PI) / 180;
}
export const POPULAR_CITIES = [
    { name: 'Hyderabad (Hitec City)', state: 'Telangana', lat: 17.4435, lng: 78.3772, description: 'IT Corridor & Financial Hub' },
    { name: 'Hyderabad (Jubilee Hills)', state: 'Telangana', lat: 17.4325, lng: 78.4072, description: 'Upscale Dining & Salons' },
    { name: 'Hyderabad (Gachibowli)', state: 'Telangana', lat: 17.4401, lng: 78.3489, description: 'Hotels & Tech Parks' },
    { name: 'Hyderabad (Madhapur)', state: 'Telangana', lat: 17.4485, lng: 78.3866, description: 'Clinics & 24/7 Chemists' },
    { name: 'Bengaluru (Indiranagar)', state: 'Karnataka', lat: 12.9784, lng: 77.6408, description: 'Metro Hub & Boutiques' },
    { name: 'Bengaluru (Koramangala)', state: 'Karnataka', lat: 12.9352, lng: 77.6245, description: 'Startups & Culinary' },
    { name: 'Mumbai (Bandra West)', state: 'Maharashtra', lat: 19.0596, lng: 72.8295, description: 'Coastal Metro & Lounges' },
    { name: 'New Delhi (Connaught Place)', state: 'Delhi', lat: 28.6315, lng: 77.2167, description: 'Central Capital District' },
    { name: 'Chennai (Anna Nagar)', state: 'Tamil Nadu', lat: 13.0850, lng: 80.2101, description: 'Commercial & Healthcare' },
    { name: 'Pune (Koregaon Park)', state: 'Maharashtra', lat: 18.5362, lng: 73.8938, description: 'Wellness & Boutique Stays' },
];
/**
 * Local fast-lookup dictionary for Indian & Metro locations
 */
const LOCATION_DICTIONARY = {
    'hitec city': { lat: 17.4435, lng: 78.3772, name: 'Hitec City, Hyderabad' },
    'jubilee hills': { lat: 17.4325, lng: 78.4072, name: 'Jubilee Hills, Hyderabad' },
    'banjara hills': { lat: 17.4156, lng: 78.4348, name: 'Banjara Hills, Hyderabad' },
    'gachibowli': { lat: 17.4401, lng: 78.3489, name: 'Gachibowli, Hyderabad' },
    'madhapur': { lat: 17.4485, lng: 78.3866, name: 'Madhapur, Hyderabad' },
    'kondapur': { lat: 17.4699, lng: 78.3578, name: 'Kondapur, Hyderabad' },
    'begumpet': { lat: 17.4442, lng: 78.4719, name: 'Begumpet, Hyderabad' },
    'secunderabad': { lat: 17.4399, lng: 78.4983, name: 'Secunderabad, Telangana' },
    'hyderabad': { lat: 17.3850, lng: 78.4867, name: 'Hyderabad, Telangana' },
    'bengaluru': { lat: 12.9716, lng: 77.5946, name: 'Bengaluru, Karnataka' },
    'bangalore': { lat: 12.9716, lng: 77.5946, name: 'Bengaluru, Karnataka' },
    'indiranagar': { lat: 12.9784, lng: 77.6408, name: 'Indiranagar, Bengaluru' },
    'koramangala': { lat: 12.9352, lng: 77.6245, name: 'Koramangala, Bengaluru' },
    'whitefield': { lat: 12.9698, lng: 77.7500, name: 'Whitefield, Bengaluru' },
    'mumbai': { lat: 19.0760, lng: 72.8777, name: 'Mumbai, Maharashtra' },
    'bandra': { lat: 19.0596, lng: 72.8295, name: 'Bandra, Mumbai' },
    'andheri': { lat: 19.1136, lng: 72.8697, name: 'Andheri, Mumbai' },
    'delhi': { lat: 28.6139, lng: 77.2090, name: 'New Delhi, Delhi' },
    'connaught place': { lat: 28.6315, lng: 77.2167, name: 'Connaught Place, New Delhi' },
    'gurgaon': { lat: 28.4595, lng: 77.0266, name: 'Gurgaon, Haryana' },
    'gurugram': { lat: 28.4595, lng: 77.0266, name: 'Gurugram, Haryana' },
    'noida': { lat: 28.5355, lng: 77.3910, name: 'Noida, Uttar Pradesh' },
    'pune': { lat: 18.5204, lng: 73.8567, name: 'Pune, Maharashtra' },
    'chennai': { lat: 13.0827, lng: 80.2707, name: 'Chennai, Tamil Nadu' },
    'kolkata': { lat: 22.5726, lng: 88.3639, name: 'Kolkata, West Bengal' },
    'ahmedabad': { lat: 23.0225, lng: 72.5714, name: 'Ahmedabad, Gujarat' },
};
/**
 * Geocodes an address or location query using fast lookup with online fallback
 */
export async function geocodeLocationQuery(query) {
    const clean = query.trim().toLowerCase();
    if (!clean)
        return null;
    // 1. Direct dictionary check
    for (const [key, val] of Object.entries(LOCATION_DICTIONARY)) {
        if (clean.includes(key) || key.includes(clean)) {
            return val;
        }
    }
    // 2. Fetch from OpenStreetMap Nominatim for arbitrary custom addresses
    try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`, {
            headers: { 'Accept-Language': 'en' }
        });
        const data = await res.json();
        if (data && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon),
                name: data[0].display_name.split(',').slice(0, 2).join(','),
            };
        }
    }
    catch (err) {
        console.warn('Geocoding network fetch failed, using default', err);
    }
    // Fallback to primary metro default
    return { lat: 17.4435, lng: 78.3772, name: `${query} (Default Metro Area)` };
}
/**
 * Returns Google Maps search URL
 */
export function getGoogleMapsSearchUrl(queryOrPlace) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(queryOrPlace)}`;
}
/**
 * Returns Google Maps directions URL
 */
export function getGoogleMapsDirectionsUrl(lat, lng) {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}
