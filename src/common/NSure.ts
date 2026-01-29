import nsureSDK from '@nsure-ai/web-client-sdk';

function fun(): string | null {
  if (nsureSDK) return nsureSDK.getDeviceId();
  return null;
}

export default fun;
