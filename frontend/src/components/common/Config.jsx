export const apiUrl = import.meta.env.VITE_API_URL;
const userInfo = localStorage.getItem('userInfolms')
export const token = userInfo ? JSON.parse(userInfo).token : null

export const convertMinutesToHours = (totalMinutes) => {
    if (!totalMinutes) return "0 min";

    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60; // The modulo operator % gets the remainder

    const hDisplay = hours > 0 ? `${hours} ${hours === 1 ? "hour" : "hours"}` : "";
    const mDisplay = mins > 0 ? `${mins} min` : "";

    // Join with a space and trim any extra whitespace
    return `${hDisplay} ${mDisplay}`.trim();
};