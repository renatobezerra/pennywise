const { remote } = require('electron');
const CryptoJS = require('crypto-js');

const secretKey = remote.process.env.PROCEDURESECRET || '';

const encrypt = (text) => {
  return CryptoJS.AES.encrypt(text, secretKey).toString();
}

const decrypt = (hash) => {
  let bytes = CryptoJS.AES.decrypt(hash, secretKey);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}

module.exports = {
    encrypt,
    decrypt,
};