export default function shortenAddress (address, length) {
    let start = address.substring(0, length);
    let end = address.substring(address.length - length);
    return start + '...' + end;
};