import { RtcRole, RtcTokenBuilder } from "agora-access-token";

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
