import CryptoJS from 'crypto-js';

const AES_SECRETKEY = process.env.REACT_APP_AES_SECRETKEY;

//복호화
export const decrypt = (encrypted) => {
    var decrypted = CryptoJS.AES.decrypt(encrypted, AES_SECRETKEY);
    return decrypted;
};
