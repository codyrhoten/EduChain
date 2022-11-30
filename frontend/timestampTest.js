const formatTimestamp = obj => {
    console.log(obj)
    let timestamp = new Date(obj.timeStamp);
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

const block = {
    "timeStamp": "1669837113546",
    "data": [
        {
            "from": "ecc05873f797acd704068695d524f93d8d817e3d",
            "to": "d334371fe9555603d107b5e96c14ab5328661d97",
            "amount": 100000,
            "gas": 0
        }
    ],
    "hash": "11a7e0e90062c003abe51c27c869a3b60d081fde61536232c9bdf791ae0c8a75",
    "prevHash": "",
    "nonce": 0
};

console.log(formatTimestamp(block))