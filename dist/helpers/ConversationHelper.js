"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoToken = void 0;
const agora_access_token_1 = require("agora-access-token");
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
