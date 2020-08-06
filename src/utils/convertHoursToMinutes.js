module.exports = function convertHoursToMinutes(time = '') {
    const [hours = 0, minutes = 0] = time.split(':').map(Number);

    const timeInMinutes = hours * 60 + minutes;

    return timeInMinutes;
};
