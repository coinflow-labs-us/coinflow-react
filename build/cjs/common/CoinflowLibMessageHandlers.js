"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWalletPubkey = getWalletPubkey;
exports.handleIFrameMessage = handleIFrameMessage;
exports.getHandlers = getHandlers;
var tslib_1 = require("tslib");
var CoinflowUtils_1 = require("./CoinflowUtils");
var SolanaPeerDeps_1 = require("./SolanaPeerDeps");
var IFrameMessageMethods;
(function (IFrameMessageMethods) {
    IFrameMessageMethods["SignMessage"] = "signMessage";
    IFrameMessageMethods["SignTransaction"] = "signTransaction";
    IFrameMessageMethods["SendTransaction"] = "sendTransaction";
    IFrameMessageMethods["HeightChange"] = "heightChange";
    IFrameMessageMethods["Success"] = "success";
    IFrameMessageMethods["Loaded"] = "loaded";
})(IFrameMessageMethods || (IFrameMessageMethods = {}));
function getWalletPubkey(input) {
    var wallet;
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
        if ('accountId' in wallet)
            return wallet.accountId ? wallet.accountId : undefined;
    }
    return null;
}
function handleIFrameMessage(rawMessage, handlers) {
    var walletCall;
    try {
        walletCall = JSON.parse(rawMessage);
        if (!('method' in walletCall) || !('data' in walletCall))
            return;
    }
    catch (e) {
        console.error('handleIFrameMessage JSON parse', e);
        return;
    }
    var data = walletCall.data, method = walletCall.method;
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
        case IFrameMessageMethods.HeightChange:
            if (!handlers.handleHeightChange)
                return;
            return handlers.handleHeightChange(data);
        case IFrameMessageMethods.Success:
            if (!handlers.onSuccess)
                return;
            handlers.onSuccess(walletCall.info);
            return;
        case IFrameMessageMethods.Loaded:
            return;
    }
    console.warn("Didn't expect to get here, handleIFrameMessage method:".concat(method, " is not one of ").concat(Object.values(IFrameMessageMethods)));
}
function getHandlers(props) {
    var chain;
    var wallet;
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
            handleSendTransaction: function () {
                throw new Error('handleSendTransaction Not Implemented');
            },
            handleSignMessage: function () {
                throw new Error('handleSendTransaction Not Implemented');
            },
            handleSignTransaction: function () {
                throw new Error('handleSendTransaction Not Implemented');
            },
            onSuccess: props.onSuccess,
        };
    }
    return CoinflowUtils_1.CoinflowUtils.byBlockchain(chain, {
        solana: function () {
            return getSolanaWalletHandlers({
                wallet: wallet,
                onSuccess: props.onSuccess,
            });
        },
        near: function () {
            return getNearWalletHandlers({
                wallet: wallet,
                onSuccess: props.onSuccess,
            });
        },
        eth: function () {
            return getEvmWalletHandlers({
                wallet: wallet,
                onSuccess: props.onSuccess,
            });
        },
        polygon: function () {
            return getEvmWalletHandlers({
                wallet: wallet,
                onSuccess: props.onSuccess,
            });
        },
        base: function () {
            return getEvmWalletHandlers({
                wallet: wallet,
                onSuccess: props.onSuccess,
            });
        },
        arbitrum: function () {
            return getEvmWalletHandlers({
                wallet: wallet,
                onSuccess: props.onSuccess,
            });
        },
        user: function () { return getSessionKeyHandlers(props); },
    })();
}
function getSolanaWalletHandlers(_a) {
    var _this = this;
    var wallet = _a.wallet, onSuccess = _a.onSuccess;
    return {
        handleSendTransaction: function (transaction) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var tx;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tx = getSolanaTransaction(transaction);
                        return [4 /*yield*/, wallet.sendTransaction(tx)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); },
        handleSignMessage: function (message) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var signMessage, signedMessage;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        signMessage = wallet.signMessage;
                        if (!signMessage) {
                            throw new Error('signMessage is not supported by this wallet');
                        }
                        return [4 /*yield*/, signMessage(new TextEncoder().encode(message))];
                    case 1:
                        signedMessage = _a.sent();
                        if (!SolanaPeerDeps_1.base58)
                            throw new Error('bs58 dependency is required');
                        return [2 /*return*/, SolanaPeerDeps_1.base58.encode(signedMessage)];
                }
            });
        }); },
        handleSignTransaction: function (transaction) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var signTransaction, tx, signedTransaction;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        signTransaction = wallet.signTransaction;
                        if (!signTransaction) {
                            throw new Error('signTransaction is not supported by this wallet');
                        }
                        tx = getSolanaTransaction(transaction);
                        return [4 /*yield*/, signTransaction(tx)];
                    case 1:
                        signedTransaction = _a.sent();
                        if (!SolanaPeerDeps_1.base58)
                            throw new Error('bs58 dependency is required');
                        return [2 /*return*/, SolanaPeerDeps_1.base58.encode(signedTransaction.serialize({
                                requireAllSignatures: false,
                                verifySignatures: false,
                            }))];
                }
            });
        }); },
        onSuccess: onSuccess,
    };
}
function getSolanaTransaction(data) {
    if (!SolanaPeerDeps_1.web3)
        throw new Error('@solana/web3.js is not defined. Please install @solana/web3.js into your project');
    if (!SolanaPeerDeps_1.base58)
        throw new Error('bs58 is not defined. Please install bs58 into your project');
    var parsedUInt8Array = SolanaPeerDeps_1.base58.decode(data);
    var vtx = SolanaPeerDeps_1.web3.VersionedTransaction.deserialize(parsedUInt8Array);
    if (vtx.version === 'legacy')
        return SolanaPeerDeps_1.web3.Transaction.from(parsedUInt8Array);
    return vtx;
}
function getNearWalletHandlers(_a) {
    var _this = this;
    var wallet = _a.wallet, onSuccess = _a.onSuccess;
    return {
        handleSendTransaction: function (transaction) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var action, executionOutcome, transactionResult;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        action = JSON.parse(Buffer.from(transaction, 'base64').toString());
                        return [4 /*yield*/, wallet.signAndSendTransaction(action)];
                    case 1:
                        executionOutcome = _a.sent();
                        if (!executionOutcome)
                            throw new Error('Transaction did not send');
                        transactionResult = executionOutcome.transaction;
                        return [2 /*return*/, transactionResult.hash];
                }
            });
        }); },
        onSuccess: onSuccess,
    };
}
function getEvmWalletHandlers(_a) {
    var _this = this;
    var wallet = _a.wallet, onSuccess = _a.onSuccess;
    return {
        handleSendTransaction: function (transaction) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var tx, hash;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tx = JSON.parse(Buffer.from(transaction, 'base64').toString());
                        return [4 /*yield*/, wallet.sendTransaction(tx)];
                    case 1:
                        hash = (_a.sent()).hash;
                        return [2 /*return*/, hash];
                }
            });
        }); },
        handleSignMessage: function (message) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, wallet.signMessage(message)];
            });
        }); },
        onSuccess: onSuccess,
    };
}
function getSessionKeyHandlers(_a) {
    var _this = this;
    var onSuccess = _a.onSuccess;
    return {
        handleSendTransaction: function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, Promise.resolve('')];
            });
        }); },
        onSuccess: onSuccess,
    };
}
//# sourceMappingURL=CoinflowLibMessageHandlers.js.map