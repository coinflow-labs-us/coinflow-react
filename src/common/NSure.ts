import nsureSDK from '@nsure-ai/web-client-sdk';

function getNSureDeviceId(): string | null {
  if (typeof window !== 'undefined') {
    const urlDeviceId = new URLSearchParams(window.location.search).get(
      'deviceId'
    );
    if (urlDeviceId) return urlDeviceId;
  }

  if (nsureSDK) return nsureSDK.getDeviceId();
  return null;
}

export default getNSureDeviceId;
