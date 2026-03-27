"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IFrameMessageMethods = void 0;
exports.getWalletPubkey = getWalletPubkey;
exports.handleIFrameMessage = handleIFrameMessage;
exports.getHandlers = getHandlers;
const CoinflowUtils_1 = require("./CoinflowUtils");
const SolanaPeerDeps_1 = require("./SolanaPeerDeps");
var IFrameMessageMethods;
(function (IFrameMessageMethods) {
    IFrameMessageMethods["SignMessage"] = "signMessage";
    IFrameMessageMethods["SignTransaction"] = "signTransaction";
    IFrameMessageMethods["SendTransaction"] = "sendTransaction";
    IFrameMessageMethods["HeightChange"] = "heightChange";
    IFrameMessageMethods["Success"] = "success";
    IFrameMessageMethods["AuthDeclined"] = "authDeclined";
    IFrameMessageMethods["Loaded"] = "loaded";
    IFrameMessageMethods["AccountLinked"] = "accountLinked";
    IFrameMessageMethods["Redirect"] = "redirect";
})(IFrameMessageMethods || (exports.IFrameMessageMethods = IFrameMessageMethods = {}));
function getWalletPubkey(input) {
    let wallet;
    if ('signer' in input &&
        typeof input.signer === 'object' &&
        input.signer &&
        'wallet' in input.signer)
        wallet = input.signer.wallet;
    else if ('wallet' in input && input.wallet)
        wallet = input.wallet;
    if (!wallet)
        return;
    if (typeof wallet === 'string')
        return wallet;
    if (typeof wallet === 'object') {
        if ('publicKey' in wallet)
            return wallet.publicKey ? wallet.publicKey.toString() : undefined;
        if ('address' in wallet)
            return wallet.address ? wallet.address : undefined;
    }
    return null;
}
function handleIFrameMessage(rawMessage, handlers, handleHeightChangeId) {
    let walletCall;
    try {
        walletCall = JSON.parse(rawMessage);
        if (!('method' in walletCall) || !('data' in walletCall))
            return;
    }
    catch (e) {
        console.error('handleIFrameMessage JSON parse', e);
        return;
    }
    const { data, method } = walletCall;
    switch (method) {
        case IFrameMessageMethods.SignMessage:
            if (!handlers.handleSignMessage)
                return;
            return handlers.handleSignMessage(data);
        case IFrameMessageMethods.SignTransaction:
            if (!handlers.handleSignTransaction)
                return;
            return handlers.handleSignTransaction(data);
        case IFrameMessageMethods.SendTransaction:
            return handlers.handleSendTransaction(data);
        case IFrameMessageMethods.HeightChange + ':' + handleHeightChangeId:
            if (!handlers.handleHeightChange)
                return;
            return handlers.handleHeightChange(data);
        case IFrameMessageMethods.Success:
            if (!handlers.onSuccess)
                return;
            handlers.onSuccess(walletCall.info);
            return;
        case IFrameMessageMethods.AuthDeclined:
            if (!handlers.onAuthDeclined)
                return;
            handlers.onAuthDeclined(walletCall.info);
            return;
        case IFrameMessageMethods.Loaded:
            return;
        case IFrameMessageMethods.AccountLinked:
            return;
        case IFrameMessageMethods.Redirect:
            window.open(data, '_blank');
            return;
    }
    console.warn(`Didn't expect to get here, handleIFrameMessage method:${method} is not one of ${Object.values(IFrameMessageMethods)}`);
}
function getHandlers(props) {
    let chain;
    let wallet;
    if ('signer' in props &&
        typeof props.signer === 'object' &&
        props.signer &&
        'blockchain' in props.signer &&
        'wallet' in props.signer) {
        chain = props.signer.blockchain;
        wallet = props.signer.wallet;
    }
    else if ('blockchain' in props && props.blockchain) {
        chain = props.blockchain;
        wallet = props.wallet;
    }
    if (!chain) {
        return {
            handleSendTransaction: () => {
                throw new Error('handleSendTransaction Not Implemented');
            },
            handleSignMessage: () => {
                throw new Error('handleSendTransaction Not Implemented');
            },
            handleSignTransaction: () => {
                throw new Error('handleSendTransaction Not Implemented');
            },
            onSuccess: props.onSuccess,
            onAuthDeclined: props.onAuthDeclined,
        };
    }
    return CoinflowUtils_1.CoinflowUtils.byBlockchain(chain, {
        solana: () => getSolanaWalletHandlers({
            wallet: wallet,
            onSuccess: props.onSuccess,
            onAuthDeclined: props.onAuthDeclined,
        }),
        eth: () => getEvmWalletHandlers({
            wallet: wallet,
            onSuccess: props.onSuccess,
            onAuthDeclined: props.onAuthDeclined,
        }),
        polygon: () => getEvmWalletHandlers({
            wallet: wallet,
            onSuccess: props.onSuccess,
            onAuthDeclined: props.onAuthDeclined,
        }),
        base: () => getEvmWalletHandlers({
            wallet: wallet,
            onSuccess: props.onSuccess,
            onAuthDeclined: props.onAuthDeclined,
        }),
        arbitrum: () => getEvmWalletHandlers({
            wallet: wallet,
            onSuccess: props.onSuccess,
            onAuthDeclined: props.onAuthDeclined,
        }),
        stellar: () => getStellarWalletHandlers({
            wallet: wallet,
            onSuccess: props.onSuccess,
            onAuthDeclined: props.onAuthDeclined,
        }),
        monad: () => getEvmWalletHandlers({
            wallet: wallet,
            onSuccess: props.onSuccess,
            onAuthDeclined: props.onAuthDeclined,
        }),
        tempo: () => getEvmWalletHandlers({
            wallet: wallet,
            onSuccess: props.onSuccess,
            onAuthDeclined: props.onAuthDeclined,
        }),
        user: () => getSessionKeyHandlers(props),
    })();
}
function getSolanaWalletHandlers({ wallet, onSuccess, onAuthDeclined, }) {
    return {
        handleSendTransaction: async (transaction) => {
            const tx = getSolanaTransaction(transaction);
            return await wallet.sendTransaction(tx);
        },
        handleSignMessage: async (message) => {
            const signMessage = wallet.signMessage;
            if (!signMessage) {
                throw new Error('signMessage is not supported by this wallet');
            }
            const signedMessage = await signMessage(new TextEncoder().encode(message));
            if (!SolanaPeerDeps_1.base58)
                throw new Error('bs58 dependency is required');
            return SolanaPeerDeps_1.base58.encode(signedMessage);
        },
        handleSignTransaction: async (transaction) => {
            const signTransaction = wallet.signTransaction;
            if (!signTransaction) {
                throw new Error('signTransaction is not supported by this wallet');
            }
            const tx = getSolanaTransaction(transaction);
            const signedTransaction = await signTransaction(tx);
            if (!SolanaPeerDeps_1.base58)
                throw new Error('bs58 dependency is required');
            return SolanaPeerDeps_1.base58.encode(Uint8Array.from(signedTransaction.serialize({
                requireAllSignatures: false,
                verifySignatures: false,
            })));
        },
        onSuccess,
        onAuthDeclined,
    };
}
function getSolanaTransaction(data) {
    if (!SolanaPeerDeps_1.web3)
        throw new Error('@solana/web3.js is not defined. Please install @solana/web3.js into your project');
    if (!SolanaPeerDeps_1.base58)
        throw new Error('bs58 is not defined. Please install bs58 into your project');
    const parsedUInt8Array = SolanaPeerDeps_1.base58.decode(data);
    const vtx = SolanaPeerDeps_1.web3.VersionedTransaction.deserialize(parsedUInt8Array);
    if (vtx.version === 'legacy')
        return SolanaPeerDeps_1.web3.Transaction.from(parsedUInt8Array);
    return vtx;
}
function getEvmWalletHandlers({ wallet, onSuccess, onAuthDeclined, }) {
    return {
        handleSendTransaction: async (transaction) => {
            const tx = JSON.parse(Buffer.from(transaction, 'base64').toString());
            const { hash } = await wallet.sendTransaction(tx);
            return hash;
        },
        handleSignMessage: async (message) => {
            return wallet.signMessage(message);
        },
        onSuccess,
        onAuthDeclined,
    };
}
function getStellarWalletHandlers({ wallet, onSuccess, onAuthDeclined, }) {
    return {
        handleSendTransaction: async (transaction) => {
            // transaction is unsigned base64 XDR
            // dapp needs to handle sending and confirming
            throw new Error(`sendTransaction is not supported on stellar, error when sending: ${transaction}`);
        },
        handleSignMessage: async (message) => {
            if (!wallet.signMessage) {
                throw new Error('signMessage is not supported by this wallet');
            }
            // Returns base64-encoded signature
            return await wallet.signMessage(message);
        },
        handleSignTransaction: async (transaction) => {
            if (!wallet.signTransaction) {
                throw new Error('signTransaction is not supported by this wallet');
            }
            // Returns signed base64 XDR
            return await wallet.signTransaction(transaction);
        },
        onSuccess,
        onAuthDeclined,
    };
}
function getSessionKeyHandlers({ onSuccess, onAuthDeclined, }) {
    return {
        handleSendTransaction: async () => {
            return Promise.resolve('');
        },
        onSuccess,
        onAuthDeclined,
    };
}
//# sourceMappingURL=CoinflowLibMessageHandlers.js.map