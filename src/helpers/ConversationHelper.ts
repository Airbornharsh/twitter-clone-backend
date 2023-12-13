import { RtcRole, RtcTokenBuilder } from "agora-access-token";
import CryptoJS from "crypto-js";

const key = process.env.ENCRYTION_SECRET_KEY as string | undefined;

export const videoToken = async (
  groupConversationId: string,
  userId: string
) => {
  try {
    const agoraAppId = process.env.AGORA_APP_ID;
    const agoraAppCertificate = process.env.AGORA_APP_CERTIFICATE;
    const newUserId = parseInt(userId.slice(15, 23), 16);
    const role = RtcRole.PUBLISHER;

    const expirationTimeInSeconds = Math.ceil(Date.now() / 1000) + 36000;

    const token = RtcTokenBuilder.buildTokenWithUid(
      agoraAppId!,
      agoraAppCertificate!,
      groupConversationId,
      newUserId,
      role,
      expirationTimeInSeconds
    );

    return token;
  } catch (e) {
    console.log(e);
  }
};

export const personalVideoToken = async (
  conversationId: string,
  userId: string
) => {
  try {
    const agoraAppId = process.env.AGORA_APP_ID;
    const agoraAppCertificate = process.env.AGORA_APP_CERTIFICATE;
    const newUserId = parseInt(userId.slice(15, 23), 16);
    const role = RtcRole.PUBLISHER;

    const expirationTimeInSeconds = Math.ceil(Date.now() / 1000) + 36000;

    const token = RtcTokenBuilder.buildTokenWithUid(
      agoraAppId!,
      agoraAppCertificate!,
      conversationId,
      newUserId,
      role,
      expirationTimeInSeconds
    );

    return token;
  } catch (e) {
    console.log(e);
  }
};

export const encryptMessage = (message: string) => {
  // const cipher = crypto.createCipher("aes-256-ctr", bufferKey);
  // const encryptedMessage = Buffer.concat([
  //   cipher.update(message, "utf8"),
  //   cipher.final(),
  // ]);
  // return encryptedMessage.toString();
  const ciphertext = CryptoJS.AES.encrypt(message, key!).toString();
  return ciphertext;
};

export const decryptMessage = (encryptedMessage: string) => {
  // const decipher = crypto.createDecipher("aes-256-ctr", bufferKey);
  // const decryptedMessage = Buffer.concat([
  //   decipher.update(encryptedMessage),
  //   decipher.final(),
  // ]);
  // return decryptedMessage.toString("utf8");
  const decryptedBytes = CryptoJS.AES.decrypt(encryptedMessage, key!);
  const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
  return decryptedText;
};
