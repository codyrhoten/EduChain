const formatTimestamp = ts => {
    let timestamp = new Date(ts);
    let tz = timestamp.toTimeString().match(/\((.+)\)/)[1];
    tz = tz.match(/[A-Z]/g).join('');
    timestamp = (timestamp.getMonth() + 1) +
        '/' + timestamp.getDate() +
        '/' + timestamp.getFullYear() +
        ' ' + timestamp.getHours() +
        ':' + timestamp.getMinutes() +
        ':' + timestamp.getSeconds() +
        ' ' + tz;
    return timestamp;
};

module.exports = formatTimestamp;