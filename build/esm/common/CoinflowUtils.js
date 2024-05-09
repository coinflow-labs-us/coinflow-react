import { __awaiter, __generator } from "tslib";
import { web3, base58 } from './SolanaPeerDeps';
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
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
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
    CoinflowUtils.prototype.getCreditBalance = function (publicKey, merchantId, blockchain) {
        return __awaiter(this, void 0, void 0, function () {
            var response, credits;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch(this.url + "/api/customer/balances/".concat(merchantId), {
                            method: 'GET',
                            headers: {
                                'x-coinflow-auth-wallet': publicKey,
                                'x-coinflow-auth-blockchain': blockchain,
                            },
                        })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        credits = (_a.sent()).credits;
                        return [2 /*return*/, credits];
                }
            });
        });
    };
    CoinflowUtils.getCoinflowBaseUrl = function (env) {
        if (!env || env === 'prod')
            return 'https://coinflow.cash';
        if (env === 'local')
            return 'http://localhost:3000';
        return "https://".concat(env, ".coinflow.cash");
    };
    CoinflowUtils.getCoinflowApiUrl = function (env) {
        if (!env || env === 'prod')
            return 'https://api.coinflow.cash';
        if (env === 'local')
            return 'http://localhost:5000';
        return "https://api-".concat(env, ".coinflow.cash");
    };
    CoinflowUtils.getCoinflowUrl = function (_a) {
        var _b;
        var walletPubkey = _a.walletPubkey, route = _a.route, routePrefix = _a.routePrefix, env = _a.env, amount = _a.amount, transaction = _a.transaction, blockchain = _a.blockchain, supportsVersionedTransactions = _a.supportsVersionedTransactions, webhookInfo = _a.webhookInfo, email = _a.email, loaderBackground = _a.loaderBackground, handleHeightChange = _a.handleHeightChange, bankAccountLinkRedirect = _a.bankAccountLinkRedirect, additionalWallets = _a.additionalWallets, nearDeposit = _a.nearDeposit, chargebackProtectionData = _a.chargebackProtectionData, merchantCss = _a.merchantCss, color = _a.color, rent = _a.rent, lockDefaultToken = _a.lockDefaultToken, token = _a.token, tokens = _a.tokens, planCode = _a.planCode, disableApplePay = _a.disableApplePay, disableGooglePay = _a.disableGooglePay, customerInfo = _a.customerInfo, settlementType = _a.settlementType, lockAmount = _a.lockAmount, nativeSolToConvert = _a.nativeSolToConvert, theme = _a.theme, usePermit = _a.usePermit, transactionSigner = _a.transactionSigner, authOnly = _a.authOnly, deviceId = _a.deviceId, jwtToken = _a.jwtToken;
        var prefix = routePrefix
            ? "/".concat(routePrefix, "/").concat(blockchain)
            : "/".concat(blockchain);
        var url = new URL(prefix + route, CoinflowUtils.getCoinflowBaseUrl(env));
        url.searchParams.append('pubkey', walletPubkey);
        if (transaction) {
            url.searchParams.append('transaction', transaction);
        }
        if (amount) {
            url.searchParams.append('amount', amount.toString());
        }
        if (supportsVersionedTransactions) {
            url.searchParams.append('supportsVersionedTransactions', 'true');
        }
        if (webhookInfo) {
            url.searchParams.append('webhookInfo', Buffer.from(JSON.stringify(webhookInfo)).toString('base64'));
        }
        if (theme) {
            url.searchParams.append('theme', Buffer.from(JSON.stringify(theme)).toString('base64'));
        }
        if (customerInfo) {
            url.searchParams.append('customerInfo', Buffer.from(JSON.stringify(customerInfo)).toString('base64'));
        }
        if (email) {
            url.searchParams.append('email', email);
        }
        if (token) {
            url.searchParams.append('token', token.toString());
        }
        if (tokens) {
            url.searchParams.append('tokens', tokens.toString());
        }
        if (loaderBackground) {
            url.searchParams.append('loaderBackground', loaderBackground);
        }
        if (handleHeightChange) {
            url.searchParams.append('useHeightChange', 'true');
        }
        if (bankAccountLinkRedirect) {
            url.searchParams.append('bankAccountLinkRedirect', bankAccountLinkRedirect);
        }
        if (additionalWallets)
            url.searchParams.append('additionalWallets', JSON.stringify(additionalWallets));
        if (nearDeposit)
            url.searchParams.append('nearDeposit', nearDeposit);
        if (chargebackProtectionData)
            url.searchParams.append('chargebackProtectionData', JSON.stringify(chargebackProtectionData));
        if (deviceId) {
            url.searchParams.append('deviceId', deviceId);
        }
        else {
            if (typeof window !== 'undefined') {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                var deviceId_1 = (_b = window === null || window === void 0 ? void 0 : window.nSureSDK) === null || _b === void 0 ? void 0 : _b.getDeviceId();
                if (deviceId_1)
                    url.searchParams.append('deviceId', deviceId_1);
            }
        }
        if (merchantCss)
            url.searchParams.append('merchantCss', merchantCss);
        if (color)
            url.searchParams.append('color', color);
        if (rent)
            url.searchParams.append('rent', rent.lamports.toString());
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
        if (jwtToken)
            url.searchParams.append('jwtToken', jwtToken);
        return url.toString();
    };
    CoinflowUtils.getTransaction = function (props) {
        if ('transaction' in props && props.transaction !== undefined) {
            var transaction = props.transaction;
            if (web3 && transaction instanceof web3.Transaction) {
                if (!base58)
                    throw new Error('bs58 dependency is required for Solana');
                return base58.encode(transaction.serialize({
                    requireAllSignatures: false,
                    verifySignatures: false,
                }));
            }
            if (web3 && transaction instanceof web3.VersionedTransaction) {
                if (!base58)
                    throw new Error('bs58 dependency is required for Solana');
                return base58.encode(transaction.serialize());
            }
            return btoa(JSON.stringify(transaction));
        }
        if ('action' in props && props.action !== undefined) {
            return btoa(JSON.stringify(props.action));
        }
        return undefined;
    };
    CoinflowUtils.byBlockchain = function (blockchain, args) {
        switch (blockchain) {
            case 'solana':
                return args.solana;
            case 'near':
                return args.near;
            case 'polygon':
                return args.polygon;
            case 'eth':
                if (args.eth === undefined)
                    throw new Error('blockchain not supported for this operation!');
                return args.eth;
            case 'base':
                return args.base;
            default:
                throw new Error('blockchain not supported!');
        }
    };
    return CoinflowUtils;
}());
export { CoinflowUtils };
//# sourceMappingURL=CoinflowUtils.js.map