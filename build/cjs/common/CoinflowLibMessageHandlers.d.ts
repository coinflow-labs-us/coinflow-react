import { CoinflowPurchaseProps } from './CoinflowTypes';
export type WalletCall = {
    method: IFrameMessageMethods;
    data: string;
};
export interface IFrameMessageHandlers {
    handleSendTransaction: (transaction: string) => Promise<string>;
    handleSignMessage?: (message: string) => Promise<string>;
    handleSignTransaction?: (transaction: string) => Promise<string>;
    handleHeightChange?: (height: string) => void;
}
declare enum IFrameMessageMethods {
    SignMessage = "signMessage",
    SignTransaction = "signTransaction",
    SendTransaction = "sendTransaction",
    HeightChange = "heightChange"
}
export declare function getWalletPubkey({ wallet, }: Pick<CoinflowPurchaseProps, 'wallet'>): string | null | undefined;
export declare function handleIFrameMessage(rawMessage: string, handlers: IFrameMessageHandlers): Promise<string> | void;
export declare function getHandlers({ wallet, blockchain, }: Pick<CoinflowPurchaseProps, 'wallet' | 'blockchain'>): Omit<IFrameMessageHandlers, 'handleHeightChange'>;
export {};
