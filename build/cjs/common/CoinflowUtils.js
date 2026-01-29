"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoinflowUtils = void 0;
exports.getCustomerName = getCustomerName;
var tslib_1 = require("tslib");
var SolanaPeerDeps_1 = require("./SolanaPeerDeps");
var lz_string_1 = tslib_1.__importDefault(require("lz-string"));
var Subtotal_1 = require("./types/Subtotal");
var NSure_1 = tslib_1.__importDefault(require("./NSure"));
var CoinflowUtils = /** @class */ (function () {
    function CoinflowUtils(env) {
        this.env = env !== null && env !== void 0 ? env : 'prod';
        if (this.env === 'prod')
            this.url = 'https://api.coinflow.cash';
        else if (this.env === 'local')
            this.url = 'http://localhost:5000';
        else
            this.url = "https://api-".concat(this.env, ".coinflow.cash");
    }
    CoinflowUtils.prototype.getNSurePartnerId = function (merchantId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, fetch(this.url + "/merchant/view/".concat(merchantId))
                        .then(function (response) { return response.json(); })
                        .then(function (json) { var _a; return ((_a = json.nSureSettings) === null || _a === void 0 ? void 0 : _a.nSurePartnerId) || json.nSurePartnerId; })
                        .catch(function (e) {
                        console.error(e);
                        return undefined;
                    })];
            });
        });
    };
    CoinflowUtils.getCoinflowBaseUrl = function (env) {
        if (!env || env === 'prod')
            return 'https://coinflow.cash';
        // @ts-expect-error This is for testing
        if (env === 'ngrok')
            return 'https://coinflow.ngrok.app';
        if (env === 'local')
            return 'http://localhost:3000';
        return "https://".concat(env, ".coinflow.cash");
    };
    CoinflowUtils.getCoinflowAppBaseUrl = function (env) {
        if (!env || env === 'prod')
            return 'https://app.coinflow.cash';
        // @ts-expect-error This is for testing
        if (env === 'ngrok')
            return 'https://coinflow.ngrok.app';
        if (env === 'local')
            return 'http://localhost:3003';
        return "https://app-".concat(env, ".coinflow.cash");
    };
    CoinflowUtils.getCoinflowApiUrl = function (env) {
        if (!env || env === 'prod')
            return 'https://api.coinflow.cash';
        if (env === 'local')
            return 'http://localhost:5000';
        return "https://api-".concat(env, ".coinflow.cash");
    };
    CoinflowUtils.getCoinflowUrl = function (_a) {
        var walletPubkey = _a.walletPubkey, sessionKey = _a.sessionKey, route = _a.route, routePrefix = _a.routePrefix, env = _a.env, subtotal = _a.subtotal, presentment = _a.presentment, transaction = _a.transaction, _b = _a.blockchain, blockchain = _b === void 0 ? 'solana' : _b, webhookInfo = _a.webhookInfo, email = _a.email, loaderBackground = _a.loaderBackground, handleHeightChangeId = _a.handleHeightChangeId, bankAccountLinkRedirect = _a.bankAccountLinkRedirect, additionalWallets = _a.additionalWallets, chargebackProtectionData = _a.chargebackProtectionData, merchantCss = _a.merchantCss, color = _a.color, rent = _a.rent, lockDefaultToken = _a.lockDefaultToken, tokens = _a.tokens, planCode = _a.planCode, disableApplePay = _a.disableApplePay, disableGooglePay = _a.disableGooglePay, customerInfo = _a.customerInfo, settlementType = _a.settlementType, lockAmount = _a.lockAmount, nativeSolToConvert = _a.nativeSolToConvert, theme = _a.theme, usePermit = _a.usePermit, transactionSigner = _a.transactionSigner, authOnly = _a.authOnly, deviceId = _a.deviceId, jwtToken = _a.jwtToken, origins = _a.origins, threeDsChallengePreference = _a.threeDsChallengePreference, supportEmail = _a.supportEmail, destinationAuthKey = _a.destinationAuthKey, allowedPaymentMethods = _a.allowedPaymentMethods, accountFundingTransaction = _a.accountFundingTransaction, partialUsdcChecked = _a.partialUsdcChecked, redemptionCheck = _a.redemptionCheck, allowedWithdrawSpeeds = _a.allowedWithdrawSpeeds, isZeroAuthorization = _a.isZeroAuthorization, baseUrl = _a.baseUrl;
        var prefix = routePrefix
            ? "/".concat(routePrefix, "/").concat(blockchain)
            : "/".concat(blockchain);
        var url = new URL(prefix + route, baseUrl !== null && baseUrl !== void 0 ? baseUrl : CoinflowUtils.getCoinflowBaseUrl(env));
        if (walletPubkey)
            url.searchParams.append('pubkey', walletPubkey);
        if (sessionKey)
            url.searchParams.append('sessionKey', sessionKey);
        if (transaction) {
            url.searchParams.append('transaction', transaction);
        }
        if (subtotal) {
            if ('cents' in subtotal) {
                url.searchParams.append('cents', subtotal.cents.toString());
                if ('currency' in subtotal) {
                    url.searchParams.append('currency', subtotal.currency.toString());
                }
                else {
                    url.searchParams.append('currency', Subtotal_1.Currency.USD);
                }
            }
            else {
                url.searchParams.append('token', subtotal.address.toString());
                url.searchParams.append('amount', subtotal.amount.toString());
            }
        }
        if (presentment)
            url.searchParams.append('presentment', presentment);
        if (webhookInfo) {
            url.searchParams.append('webhookInfo', lz_string_1.default.compressToEncodedURIComponent(JSON.stringify(webhookInfo)));
        }
        if (theme) {
            url.searchParams.append('theme', lz_string_1.default.compressToEncodedURIComponent(JSON.stringify(theme)));
        }
        if (customerInfo) {
            url.searchParams.append('customerInfo', lz_string_1.default.compressToEncodedURIComponent(JSON.stringify(customerInfo)));
        }
        if (email) {
            url.searchParams.append('email', email);
        }
        if (supportEmail)
            url.searchParams.append('supportEmail', supportEmail);
        if (tokens) {
            url.searchParams.append('tokens', tokens.toString());
        }
        if (loaderBackground) {
            url.searchParams.append('loaderBackground', loaderBackground);
        }
        if (handleHeightChangeId) {
            url.searchParams.append('useHeightChange', handleHeightChangeId.toString());
        }
        if (bankAccountLinkRedirect) {
            url.searchParams.append('bankAccountLinkRedirect', bankAccountLinkRedirect);
        }
        if (additionalWallets)
            url.searchParams.append('additionalWallets', lz_string_1.default.compressToEncodedURIComponent(JSON.stringify(additionalWallets)));
        if (chargebackProtectionData)
            url.searchParams.append('chargebackProtectionData', lz_string_1.default.compressToEncodedURIComponent(JSON.stringify(chargebackProtectionData)));
        if (deviceId) {
            url.searchParams.append('deviceId', deviceId);
        }
        else {
            var deviceId_1 = (0, NSure_1.default)();
            if (deviceId_1)
                url.searchParams.append('deviceId', deviceId_1);
        }
        if (merchantCss)
            url.searchParams.append('merchantCss', merchantCss);
        if (color)
            url.searchParams.append('color', color);
        if (rent)
            url.searchParams.append('rent', rent.lamports.toString());
        if (redemptionCheck)
            url.searchParams.append('redemptionCheck', 'true');
        if (nativeSolToConvert)
            url.searchParams.append('nativeSolToConvert', nativeSolToConvert.lamports.toString());
        if (lockDefaultToken)
            url.searchParams.append('lockDefaultToken', 'true');
        if (planCode)
            url.searchParams.append('planCode', planCode);
        if (disableApplePay)
            url.searchParams.append('disableApplePay', 'true');
        if (disableGooglePay)
            url.searchParams.append('disableGooglePay', 'true');
        if (settlementType)
            url.searchParams.append('settlementType', settlementType);
        if (lockAmount)
            url.searchParams.append('lockAmount', 'true');
        if (usePermit === false)
            url.searchParams.append('usePermit', 'false');
        if (transactionSigner)
            url.searchParams.append('transactionSigner', transactionSigner);
        if (authOnly === true)
            url.searchParams.append('authOnly', 'true');
        if (isZeroAuthorization === true)
            url.searchParams.append('isZeroAuthorization', 'true');
        if (partialUsdcChecked === true)
            url.searchParams.append('partialUsdcChecked', 'true');
        if (jwtToken)
            url.searchParams.append('jwtToken', jwtToken);
        if (origins)
            url.searchParams.append('origins', lz_string_1.default.compressToEncodedURIComponent(JSON.stringify(origins)));
        if (allowedPaymentMethods)
            url.searchParams.append('allowedPaymentMethods', allowedPaymentMethods.join(','));
        if (threeDsChallengePreference)
            url.searchParams.append('threeDsChallengePreference', threeDsChallengePreference);
        if (destinationAuthKey)
            url.searchParams.append('destinationAuthKey', destinationAuthKey);
        if (accountFundingTransaction)
            url.searchParams.append('accountFundingTransaction', lz_string_1.default.compressToEncodedURIComponent(JSON.stringify(accountFundingTransaction)));
        if (allowedWithdrawSpeeds)
            url.searchParams.append('allowedWithdrawSpeeds', allowedWithdrawSpeeds.join(','));
        return url.toString();
    };
    CoinflowUtils.getTransaction = function (props) {
        if (!props.blockchain)
            return undefined;
        return this.byBlockchain(props.blockchain, {
            solana: function () {
                if (!('transaction' in props))
                    return undefined;
                var transaction = props.transaction;
                if (!SolanaPeerDeps_1.web3)
                    throw new Error('@solana/web3.js dependency is required for Solana');
                if (!SolanaPeerDeps_1.base58)
                    throw new Error('bs58 dependency is required for Solana');
                if (!transaction)
                    return undefined;
                return SolanaPeerDeps_1.base58.encode(Uint8Array.from(transaction.serialize({
                    requireAllSignatures: false,
                    verifySignatures: false,
                })));
            },
            polygon: function () {
                if (!('transaction' in props))
                    return undefined;
                var transaction = props.transaction;
                return lz_string_1.default.compressToEncodedURIComponent(JSON.stringify(transaction));
            },
            eth: function () {
                if (!('transaction' in props))
                    return undefined;
                var transaction = props.transaction;
                return lz_string_1.default.compressToEncodedURIComponent(JSON.stringify(transaction));
            },
            base: function () {
                if (!('transaction' in props))
                    return undefined;
                var transaction = props.transaction;
                return lz_string_1.default.compressToEncodedURIComponent(JSON.stringify(transaction));
            },
            arbitrum: function () {
                if (!('transaction' in props))
                    return undefined;
                var transaction = props.transaction;
                return lz_string_1.default.compressToEncodedURIComponent(JSON.stringify(transaction));
            },
            monad: function () {
                if (!('transaction' in props))
                    return undefined;
                var transaction = props.transaction;
                return lz_string_1.default.compressToEncodedURIComponent(JSON.stringify(transaction));
            },
            user: function () {
                return undefined;
            },
        })();
    };
    CoinflowUtils.byBlockchain = function (blockchain, args) {
        switch (blockchain) {
            case 'solana':
                return args.solana;
            case 'polygon':
                return args.polygon;
            case 'eth':
                return args.eth;
            case 'base':
                return args.base;
            case 'arbitrum':
                return args.arbitrum;
            case 'monad':
                return args.monad;
            case 'user':
                return args.user;
            default:
                throw new Error('blockchain not supported!');
        }
    };
    return CoinflowUtils;
}());
exports.CoinflowUtils = CoinflowUtils;
function getCustomerName(info) {
    if (!info)
        return undefined;
    var firstName, lastName;
    if ('name' in info && info.name) {
        firstName = info.name.split(' ')[0];
        lastName = info.name.split(' ').slice(1).join(' ');
    }
    if ('firstName' in info && info.firstName)
        firstName = info.firstName;
    if ('lastName' in info && info.lastName)
        lastName = info.lastName;
    if (firstName && lastName)
        return {
            firstName: firstName,
            lastName: lastName,
        };
    return undefined;
}
//# sourceMappingURL=CoinflowUtils.js.map