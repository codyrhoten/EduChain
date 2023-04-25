const formatTimestamp = ts => {
    let timestamp = new Date(ts);
    let timeHour = {
        hour: timestamp.getHours(),
        meridiem: 'AM',
    }

    if (timeHour.hour > 12) {
        timeHour.hour -= 12;
        timeHour.meridiem = 'PM';
    }

    let tz = timestamp.toTimeString().match(/\((.+)\)/)[1];
    tz = tz.match(/[A-Z]/g).join('');
    timestamp = (timestamp.getMonth() + 1) +
        '/' + timestamp.getDate() +
        '/' + timestamp.getFullYear() +
        ' ' + timeHour.hour +
        ':' + timestamp.getMinutes() +
        ':' + timestamp.getSeconds() +
        ' ' + timeHour.meridiem +
        ' ' + tz;
    return timestamp;
};

module.exports = formatTimestamp;