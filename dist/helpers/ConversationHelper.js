"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.personalVideoToken = exports.videoToken = void 0;
const agora_access_token_1 = require("agora-access-token");
const key = process.env.ENCRYTION_SECRET_KEY;
const videoToken = async (groupConversationId, userId) => {
    try {
        const agoraAppId = process.env.AGORA_APP_ID;
        const agoraAppCertificate = process.env.AGORA_APP_CERTIFICATE;
        const newUserId = parseInt(userId.slice(15, 23), 16);
        const role = agora_access_token_1.RtcRole.PUBLISHER;
        const expirationTimeInSeconds = Math.ceil(Date.now() / 1000) + 36000;
        const token = agora_access_token_1.RtcTokenBuilder.buildTokenWithUid(agoraAppId, agoraAppCertificate, groupConversationId, newUserId, role, expirationTimeInSeconds);
        return token;
    }
    catch (e) {
        console.log(e);
    }
};
exports.videoToken = videoToken;
const personalVideoToken = async (conversationId, userId) => {
    try {
        const agoraAppId = process.env.AGORA_APP_ID;
        const agoraAppCertificate = process.env.AGORA_APP_CERTIFICATE;
        const newUserId = parseInt(userId.slice(15, 23), 16);
        const role = agora_access_token_1.RtcRole.PUBLISHER;
        const expirationTimeInSeconds = Math.ceil(Date.now() / 1000) + 36000;
        const token = agora_access_token_1.RtcTokenBuilder.buildTokenWithUid(agoraAppId, agoraAppCertificate, conversationId, newUserId, role, expirationTimeInSeconds);
        return token;
    }
    catch (e) {
        console.log(e);
    }
};
exports.personalVideoToken = personalVideoToken;
// export const encryptMessage = (message: string) => {
//   // const cipher = crypto.createCipher("aes-256-ctr", bufferKey);
//   // const encryptedMessage = Buffer.concat([
//   //   cipher.update(message, "utf8"),
//   //   cipher.final(),
//   // ]);
//   // return encryptedMessage.toString();
//   const ciphertext = CryptoJS.AES.encrypt(message, key!).toString();
//   return ciphertext;
// };
// export const decryptMessage = (encryptedMessage: string) => {
//   // const decipher = crypto.createDecipher("aes-256-ctr", bufferKey);
//   // const decryptedMessage = Buffer.concat([
//   //   decipher.update(encryptedMessage),
//   //   decipher.final(),
//   // ]);
//   // return decryptedMessage.toString("utf8");
//   const decryptedBytes = CryptoJS.AES.decrypt(encryptedMessage, key!);
//   const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
//   return decryptedText;
// };
