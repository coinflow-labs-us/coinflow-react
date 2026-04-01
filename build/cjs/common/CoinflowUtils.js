"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoinflowUtils = void 0;
const tslib_1 = require("tslib");
exports.getCustomerName = getCustomerName;
exports.recordFrontendError = recordFrontendError;
const SolanaPeerDeps_1 = require("./SolanaPeerDeps");
const lz_string_1 = tslib_1.__importDefault(require("lz-string"));
const Subtotal_1 = require("./types/Subtotal");
const NSure_1 = tslib_1.__importDefault(require("./NSure"));
class CoinflowUtils {
    env;
    url;
    constructor(env) {
        this.env = env ?? 'prod';
        if (this.env === 'prod')
            this.url = 'https://api.coinflow.cash';
        else if (this.env === 'local')
            this.url = 'http://localhost:5000';
        else
            this.url = `https://api-${this.env}.coinflow.cash`;
    }
    async getNSurePartnerId(merchantId) {
        return fetch(this.url + `/merchant/view/${merchantId}`)
            .then(response => response.json())
            .then((json) => json.nSureSettings?.nSurePartnerId || json.nSurePartnerId)
            .catch(e => {
            console.error(e);
            return undefined;
        });
    }
    static getCoinflowBaseUrl(env) {
        if (!env || env === 'prod')
            return 'https://coinflow.cash';
        // @ts-expect-error This is for testing
        if (env === 'ngrok')
            return 'https://coinflow.ngrok.app';
        if (env === 'local')
            return 'http://localhost:3000';
        return `https://${env}.coinflow.cash`;
    }
    static getCoinflowAppBaseUrl(env) {
        if (!env || env === 'prod')
            return 'https://app.coinflow.cash';
        // @ts-expect-error This is for testing
        if (env === 'ngrok')
            return 'https://coinflow.ngrok.app';
        if (env === 'local')
            return 'http://localhost:3003';
        return `https://app-${env}.coinflow.cash`;
    }
    static getCoinflowApiUrl(env) {
        if (!env || env === 'prod')
            return 'https://api.coinflow.cash';
        if (env === 'local')
            return 'http://localhost:5000';
        return `https://api-${env}.coinflow.cash`;
    }
    static getCoinflowUrl({ walletPubkey, sessionKey, route, routePrefix, env, subtotal, customPayInFees, presentment, transaction, blockchain = 'solana', webhookInfo, email, loaderBackground, handleHeightChangeId, bankAccountLinkRedirect, additionalWallets, chargebackProtectionData, chargebackProtectionAccountType, merchantCss, color, rent, lockDefaultToken, tokens, planCode, disableApplePay, disableGooglePay, customerInfo, settlementType, lockAmount, nativeSolToConvert, theme, usePermit, transactionSigner, authOnly, deviceId, jwtToken, origins, threeDsChallengePreference, supportEmail, destinationAuthKey, allowedPaymentMethods, accountFundingTransaction, partialUsdcChecked, redemptionCheck, allowedWithdrawSpeeds, isZeroAuthorization, zeroAuthorizationConfig, baseUrl, }) {
        const prefix = routePrefix
            ? `/${routePrefix}/${blockchain}`
            : `/${blockchain}`;
        const url = new URL(prefix + route, baseUrl ?? CoinflowUtils.getCoinflowBaseUrl(env));
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
        if (customPayInFees && customPayInFees.length > 0) {
            url.searchParams.append('customPayInFees', encodeURIComponent(JSON.stringify(customPayInFees)));
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
        if (chargebackProtectionAccountType)
            url.searchParams.append('chargebackProtectionAccountType', chargebackProtectionAccountType);
        if (deviceId) {
            url.searchParams.append('deviceId', deviceId);
        }
        else {
            const deviceId = (0, NSure_1.default)();
            if (deviceId)
                url.searchParams.append('deviceId', deviceId);
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
        // zeroAuthorizationConfig takes precedence over isZeroAuthorization
        if (zeroAuthorizationConfig) {
            url.searchParams.append('zeroAuthorizationConfig', JSON.stringify(zeroAuthorizationConfig));
        }
        else if (isZeroAuthorization === true) {
            url.searchParams.append('isZeroAuthorization', 'true');
        }
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
    }
    static getTransaction(props) {
        if (!props.blockchain)
            return undefined;
        return this.byBlockchain(props.blockchain, {
            solana: () => {
                if (!('transaction' in props))
                    return undefined;
                const { transaction } = props;
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
            polygon: () => {
                if (!('transaction' in props))
                    return undefined;
                const { transaction } = props;
                return lz_string_1.default.compressToEncodedURIComponent(JSON.stringify(transaction));
            },
            eth: () => {
                if (!('transaction' in props))
                    return undefined;
                const { transaction } = props;
                return lz_string_1.default.compressToEncodedURIComponent(JSON.stringify(transaction));
            },
            base: () => {
                if (!('transaction' in props))
                    return undefined;
                const { transaction } = props;
                return lz_string_1.default.compressToEncodedURIComponent(JSON.stringify(transaction));
            },
            arbitrum: () => {
                if (!('transaction' in props))
                    return undefined;
                const { transaction } = props;
                return lz_string_1.default.compressToEncodedURIComponent(JSON.stringify(transaction));
            },
            stellar: () => {
                if (!('transaction' in props))
                    return undefined;
                const { transaction } = props;
                if (!transaction)
                    return undefined;
                // Transaction is already base64 XDR string, pass through directly
                return transaction;
            },
            monad: () => {
                if (!('transaction' in props))
                    return undefined;
                const { transaction } = props;
                return lz_string_1.default.compressToEncodedURIComponent(JSON.stringify(transaction));
            },
            tempo: () => {
                if (!('transaction' in props))
                    return undefined;
                const { transaction } = props;
                return lz_string_1.default.compressToEncodedURIComponent(JSON.stringify(transaction));
            },
            user: () => {
                return undefined;
            },
        })();
    }
    static byBlockchain(blockchain, args) {
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
            case 'stellar':
                return args.stellar;
            case 'monad':
                return args.monad;
            case 'tempo':
                return args.tempo;
            case 'user':
                return args.user;
            default:
                throw new Error('blockchain not supported!');
        }
    }
}
exports.CoinflowUtils = CoinflowUtils;
function getCustomerName(info) {
    if (!info)
        return undefined;
    let firstName, lastName;
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
            firstName,
            lastName,
        };
    return undefined;
}
function recordFrontendError({ event, error, env, merchantId, }) {
    const isError = error instanceof Error;
    const message = isError ? error.message : error;
    const stackTrace = isError ? error.stack : '';
    fetch(`${CoinflowUtils.getCoinflowApiUrl(env)}/api/telemetry/frontend-error`, {
        method: 'POST',
        body: JSON.stringify({ message, stackTrace, merchantId, event }),
        headers: {
            'Content-Type': 'application/json',
        },
    }).catch(() => { });
}
//# sourceMappingURL=CoinflowUtils.js.map