"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHandlers = exports.handleIFrameMessage = exports.getWalletPubkey = void 0;
var tslib_1 = require("tslib");
var CoinflowUtils_1 = require("./CoinflowUtils");
var SolanaPeerDeps_1 = require("./SolanaPeerDeps");
var IFrameMessageMethods;
(function (IFrameMessageMethods) {
    IFrameMessageMethods["SignMessage"] = "signMessage";
    IFrameMessageMethods["SignTransaction"] = "signTransaction";
    IFrameMessageMethods["SendTransaction"] = "sendTransaction";
    IFrameMessageMethods["HeightChange"] = "heightChange";
})(IFrameMessageMethods || (IFrameMessageMethods = {}));
function getWalletPubkey(_a) {
    var wallet = _a.wallet;
    if ('publicKey' in wallet) {
        return wallet.publicKey.toString();
    }
    if ('address' in wallet) {
        return wallet.address;
    }
    if ('accountId' in wallet) {
        return wallet.accountId;
    }
    return null;
}
exports.getWalletPubkey = getWalletPubkey;
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
    }
    console.warn("Didn't expect to get here, handleIFrameMessage method:".concat(method, " is not one of ").concat(Object.values(IFrameMessageMethods)));
}
exports.handleIFrameMessage = handleIFrameMessage;
function getHandlers(_a) {
    var wallet = _a.wallet, blockchain = _a.blockchain;
    return CoinflowUtils_1.CoinflowUtils.byBlockchain(blockchain, {
        solana: function () { return getSolanaWalletHandlers({ wallet: wallet }); },
        near: function () { return getNearWalletHandlers({ wallet: wallet }); },
        eth: function () { return getEvmWalletHandlers({ wallet: wallet }); },
        polygon: function () { return getEvmWalletHandlers({ wallet: wallet }); },
        base: function () { return getEvmWalletHandlers({ wallet: wallet }); },
    })();
}
exports.getHandlers = getHandlers;
function getSolanaWalletHandlers(_a) {
    var _this = this;
    var wallet = _a.wallet;
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
    var wallet = _a.wallet;
    var nearWallet = wallet;
    return {
        handleSendTransaction: function (transaction) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var action, executionOutcome, transactionResult;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        action = JSON.parse(Buffer.from(transaction, 'base64').toString());
                        return [4 /*yield*/, nearWallet.signAndSendTransaction(action)];
                    case 1:
                        executionOutcome = _a.sent();
                        if (!executionOutcome)
                            throw new Error('Transaction did not send');
                        transactionResult = executionOutcome.transaction;
                        return [2 /*return*/, transactionResult.hash];
                }
            });
        }); },
    };
}
function getEvmWalletHandlers(_a) {
    var _this = this;
    var wallet = _a.wallet;
    var evmWallet = wallet;
    return {
        handleSendTransaction: function (transaction) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var tx, hash;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tx = JSON.parse(Buffer.from(transaction, 'base64').toString());
                        return [4 /*yield*/, evmWallet.sendTransaction(tx)];
                    case 1:
                        hash = (_a.sent()).hash;
                        return [2 /*return*/, hash];
                }
            });
        }); },
        handleSignMessage: function (message) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, evmWallet.signMessage(message)];
            });
        }); },
    };
}
//# sourceMappingURL=CoinflowLibMessageHandlers.js.map