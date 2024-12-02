/**
 * This formats the date from the datepicker from vue since the format isn't
 * in ISO format.
 * @param date This is the date from the primevue datepicker
 * @returns {string} Returns formatted ISO date as a string
 */
export function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${year}-${month}-${day}`
}

/**
 * This is a helper function to format the time to proper format for regular
 * human being staff people to understand.
 * @param time This is the time in military time
 * @returns {string} Returns normal human being time
 */
export function formatTime(time) {
    if (time === 24) {
        return '12 AM'
    } else if (time > 12) {
        return (time - 12) + ' PM'
    } else if (time === 12) {
        return '12 PM'
    } else {
        return time + ' AM'
    }
}