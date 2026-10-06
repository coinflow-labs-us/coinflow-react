// deviceId=nSure, sessionId=Verisoul, purchaseToken=Forter.
export interface CoinflowFraudProtectionTokens {
  deviceId?: string | null;
  sessionId?: string | null;
  purchaseToken?: string | null;
}

// Wire format of the fraud SDKs' `x-device-id` header: base64url(JSON {v, deviceId, sessionId,
// purchaseToken}), unpadded. The iOS / Android / React Native / Flutter SDKs encode it
// independently and must match the golden vector in this package's tests.
export class CoinflowFraudProtectionHeader {
  static readonly payloadVersion = 1;
  // Three tokens; Forter caps at ~1024 chars. Bounds an abusive header before decoding.
  static readonly maxLength = 8192;

  // Returns null when no provider produced a token or the header would exceed maxLength, so
  // callers omit it rather than send one the API rejects.
  static encode({
    deviceId,
    sessionId,
    purchaseToken,
  }: CoinflowFraudProtectionTokens): string | null {
    if (!deviceId && !sessionId && !purchaseToken) return null;

    const json = JSON.stringify({
      v: this.payloadVersion,
      deviceId: deviceId || null,
      sessionId: sessionId || null,
      purchaseToken: purchaseToken || null,
    });
    const header = this.base64UrlEncode(new TextEncoder().encode(json));
    return header.length > this.maxLength ? null : header;
  }

  private static base64UrlEncode(bytes: Uint8Array): string {
    let binary = '';
    // Index loop: the React Native SDK compiles this file for ES5, which can't iterate a Uint8Array.
    for (let i = 0; i < bytes.length; i++)
      binary += String.fromCharCode(bytes[i]);
    return btoa(binary)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }
}
