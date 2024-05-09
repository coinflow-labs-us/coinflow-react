import React from 'react';
import { CoinflowIFrameProps, IFrameMessageHandlers } from './common';
export type SendAndReceiveMessage = (message: string, isResponseValid: (response: string) => boolean) => Promise<string>;
export type CoinflowIFrameExposedFunctions = {
    sendAndReceiveMessage: SendAndReceiveMessage;
    listenForMessage: (isResponseValid: (response: string) => boolean) => Promise<string>;
};
export declare const CoinflowIFrame: React.ForwardRefExoticComponent<CoinflowIFrameProps & IFrameMessageHandlers & React.RefAttributes<unknown>>;
