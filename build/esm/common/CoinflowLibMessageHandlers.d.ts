import { CoinflowPurchaseProps, OnSuccessMethod } from './CoinflowTypes';
export type WalletCall = {
    method: IFrameMessageMethods;
    data: string;
} | SuccessWalletCall;
type SuccessWalletCall = {
    method: IFrameMessageMethods.Success;
    data: string;
    info: {
        paymentId: string;
        hash?: string;
    };
};
export interface IFrameMessageHandlers {
    handleSendTransaction: (transaction: string) => Promise<string>;
    handleSignMessage?: (message: string) => Promise<string>;
    handleSignTransaction?: (transaction: string) => Promise<string>;
    handleHeightChange?: (height: string) => void;
    onSuccess: OnSuccessMethod | undefined;
}
declare enum IFrameMessageMethods {
    SignMessage = "signMessage",
    SignTransaction = "signTransaction",
    SendTransaction = "sendTransaction",
    HeightChange = "heightChange",
    Success = "success",
    Loaded = "loaded"
}
export declare function getWalletPubkey(input: Pick<CoinflowPurchaseProps, 'wallet' | 'blockchain'>): string | null | undefined;
export declare function handleIFrameMessage(rawMessage: string, handlers: IFrameMessageHandlers, handleHeightChangeId: string | number): Promise<string> | void;
export declare function getHandlers(props: Pick<CoinflowPurchaseProps, 'wallet' | 'blockchain' | 'onSuccess'>): Omit<IFrameMessageHandlers, 'handleHeightChange'>;
export {};
