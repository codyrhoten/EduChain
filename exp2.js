const { randomBytes } = require('crypto')
// const secp256k1 = require('./elliptic')
const secp256k1 = require('secp256k1')


const msg = randomBytes(32)

// generate privKey
let privKey
do {
    privKey = randomBytes(32)
} while (!secp256k1.privateKeyVerify(privKey))

// get the public key in a compressed format
const pubKey = secp256k1.publicKeyCreate(privKey)
console.log(pubKey.toString())

// sign the message
const sigObj = secp256k1.ecdsaSign(msg, privKey)

// verify the signature
console.log(secp256k1.ecdsaVerify(sigObj.signature, msg, pubKey))

// generate privKey
function getPrivateKey() {
    while (true) {
        const privKey = randomBytes(32)
        if (secp256k1.privateKeyVerify(privKey)) return privKey
    }
}



// generate private and public keys
const privKey2 = getPrivateKey()
const pubKey2 = secp256k1.publicKeyCreate(privKey2)

// compressed public key from X and Y
function hashfn(x, y) {
    const pubKey = new Uint8Array(33)
    pubKey[0] = (y[31] & 1) === 0 ? 0x02 : 0x03
    pubKey.set(x, 1)
    return pubKey
}

// get X point of ecdh
const ecdhPointX = secp256k1.ecdh(pubKey2, privKey2, { hashfn }, Buffer.alloc(33))
console.log(ecdhPointX.toString('hex'))