const formatTimestamp = ts => {
    let timestamp = new Date(ts);
    let timeHour = {
        hour: timestamp.getHours(),
        meridiem: 'AM',
    }
    let timeMinutes = timestamp.getMinutes();
    let timeSeconds = timestamp.getSeconds();

    if (timeHour.hour > 12) {
        timeHour.hour -= 12;
        timeHour.meridiem = 'PM';
    }

    if (timeMinutes < 10) {
        timeMinutes = '0' + timeMinutes.toString();
    }

    if (timeSeconds < 10) {
        timeSeconds = '0' + timeSeconds.toString();
    }

    let tz = timestamp.toTimeString().match(/\((.+)\)/)[1];
    tz = tz.match(/[A-Z]/g).join('');
    timestamp = (timestamp.getMonth() + 1) +
        '/' + timestamp.getDate() +
        '/' + timestamp.getFullYear() +
        ' ' + timeHour.hour +
        ':' + timeMinutes +
        ':' + timeSeconds +
        ' ' + timeHour.meridiem +
        ' ' + tz;
    return timestamp;
};

module.exports = formatTimestamp;