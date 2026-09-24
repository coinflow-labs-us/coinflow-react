import { CoinflowPurchaseProps, OnAccountLinkedMethod, OnAccountLinkErrorMethod, OnAccountNotLinkedMethod, OnAuthDeclinedMethod, OnInputErrorMethod, OnInputValidMethod, OnSuccessMethod } from './CoinflowTypes';
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
    onAuthDeclined: OnAuthDeclinedMethod | undefined;
    onInputError?: OnInputErrorMethod | undefined;
    onInputValid?: OnInputValidMethod | undefined;
    /**
     * Called when the customer finishes linking a payment or payout account in
     * the iframe. For bank links the info carries the linked account tokens.
     */
    onAccountLinked?: OnAccountLinkedMethod | undefined;
    onAccountNotLinked?: OnAccountNotLinkedMethod | undefined;
    /**
     * Called when an account link attempt fails, with the error that caused it.
     */
    onAccountLinkError?: OnAccountLinkErrorMethod | undefined;
    /**
     * Called when the iframe opens/closes an in-page overlay (e.g. the PayPal
     * approval modal). `state` is 'open' or 'close'.
     */
    handleOverlay?: (state: string) => void;
}
export declare enum IFrameMessageMethods {
    SignMessage = "signMessage",
    SignTransaction = "signTransaction",
    SendTransaction = "sendTransaction",
    HeightChange = "heightChange",
    Success = "success",
    AuthDeclined = "authDeclined",
    InputError = "inputError",
    InputValid = "inputValid",
    Loaded = "loaded",
    AccountLinked = "accountLinked",
    AccountNotLinked = "accountNotLinked",
    AccountLinkError = "accountLinkError",
    Redirect = "redirect",
    Overlay = "overlay",
    UpdateSubtotal = "updateSubtotal"
}
export declare function getWalletPubkey(input: Pick<CoinflowPurchaseProps, 'wallet' | 'blockchain'>): string | null | undefined;
export declare function handleIFrameMessage(rawMessage: string, handlers: IFrameMessageHandlers, handleHeightChangeId: string | number): Promise<string> | void;
export declare function getHandlers(props: Pick<CoinflowPurchaseProps, 'wallet' | 'blockchain' | 'onSuccess' | 'onAuthDeclined' | 'onInputError' | 'onInputValid'> & {
    onAccountLinked?: OnAccountLinkedMethod | undefined;
    onAccountNotLinked?: OnAccountNotLinkedMethod | undefined;
    onAccountLinkError?: OnAccountLinkErrorMethod | undefined;
}): Omit<IFrameMessageHandlers, 'handleHeightChange'>;
export {};
