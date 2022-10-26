 const formatTimestamp = _block => {
    let timestamp = new Date(_block.timestamp);
    let tz = timestamp.toTimeString().match(/\((.+)\)/)[1];
    tz = tz.match(/[A-Z]/g).join('');
    timestamp = timestamp.getDate() +
        '/' + (timestamp.getMonth() + 1) +
        '/' + timestamp.getFullYear() +
        ' ' + timestamp.getHours() +
        ':' + timestamp.getMinutes() +
        ':' + timestamp.getSeconds() +
        ' ' + tz;
    return timestamp;
};

module.exports = formatTimestamp;