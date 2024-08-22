"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoinflowCardOnlyInput = exports.CoinflowCvvOnlyInput = exports.CoinflowCvvInput = exports.CoinflowCardNumberInput = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var useCardFormIframe_1 = require("./useCardFormIframe");
var common_1 = require("../common");
var CoinflowCardNumberInputComponent = (0, react_1.forwardRef)(function (props, ref) {
    var css = (0, react_1.useMemo)(function () {
        return JSON.stringify(props.css);
    }, [props.css]);
    var _a = (0, useCardFormIframe_1.useCardFormIframe)(props.env), tokenExIframe = _a.tokenExIframe, initializeTokenExIframe = _a.initializeTokenExIframe;
    (0, react_1.useImperativeHandle)(ref, function () { return ({
        getToken: function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    if (!tokenExIframe)
                        throw new Error('Unable to get token');
                    return [2 /*return*/, tokenExIframe.tokenize()];
                });
            });
        },
    }); });
    (0, react_1.useEffect)(function () {
        initializeTokenExIframe({
            css: css,
            debug: props.debug,
            origins: props.origins,
            font: props.font,
        });
    }, [initializeTokenExIframe, css, props.debug, props.origins, props.font]);
    return react_1.default.createElement("div", { id: common_1.TokenExCardNumberIframeId });
});
/**
 * Allows merchants to collect card information from their customers in a PCI-compliant way and receive the tokenized card number.
 *
 * Usage:
 * ```tsx
 *  const ref =  useRef<{getToken(): Promise<{token: string}>}>();
 *
 *  <CoinflowCardNumberInput
 *   ref={ref}
 *   env={'sandbox'}
 *   debug={true}
 *   css={{
 *     base: 'font-family: Arial, sans-serif;padding: 0 8px;border: 1px solid rgba(0, 0, 0, 0.2);margin: 0;width: 100%;font-size: 13px;line-height: 30px;height: 32px;box-sizing: border-box;-moz-box-sizing: border-box;',
 *     focus:
 *       'box-shadow: 0 0 6px 0 rgba(0, 132, 255, 0.5);border: 1px solid rgba(0, 132, 255, 0.5);outline: 0;',
 *     error:
 *       'box-shadow: 0 0 6px 0 rgba(224, 57, 57, 0.5);border: 1px solid rgba(224, 57, 57, 0.5);',
 *     cvv: {
 *       base: 'font-family: Arial, sans-serif;padding: 0 8px;border: 1px solid rgba(0, 0, 0, 0.2);margin: 0;width: 100%;font-size: 13px;line-height: 30px;height: 32px;box-sizing: border-box;-moz-box-sizing: border-box;',
 *       focus:
 *         'box-shadow: 0 0 6px 0 rgba(0, 132, 255, 0.5);border: 1px solid rgba(0, 132, 255, 0.5);outline: 0;',
 *       error:
 *         'box-shadow: 0 0 6px 0 rgba(224, 57, 57, 0.5);border: 1px solid rgba(224, 57, 57, 0.5);',
 *     },
 *   }}
 * />
 * <CoinflowCvvInput />
 *
 *  <button onClick={() => {
 *   ref.current?.getToken()
 *     .then(({token}) => console.log(token))
 *     .catch(e => console.error('GET TOKEN ERROR', e))
 *  }}>Get Token</button>
 *
 * ```
 */
exports.CoinflowCardNumberInput = (0, react_1.memo)(CoinflowCardNumberInputComponent);
/**
 * The CVV number input for creating a new tokenized card
 */
exports.CoinflowCvvInput = (0, react_1.memo)(function () { return react_1.default.createElement("div", { id: common_1.TokenExCvvContainerID }); });
var CoinflowCvvOnlyInputComponent = (0, react_1.forwardRef)(function (props, ref) {
    var css = (0, react_1.useMemo)(function () {
        return JSON.stringify(props.css);
    }, [props.css]);
    var _a = (0, useCardFormIframe_1.useCardFormIframe)(props.env), tokenExIframe = _a.tokenExIframe, initializeCvvOnlyTokenExIframe = _a.initializeCvvOnlyTokenExIframe;
    (0, react_1.useImperativeHandle)(ref, function () { return ({
        getToken: function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    if (!tokenExIframe)
                        throw new Error('Unable to get token');
                    return [2 /*return*/, tokenExIframe.tokenize()];
                });
            });
        },
    }); });
    (0, react_1.useEffect)(function () {
        initializeCvvOnlyTokenExIframe({
            css: css,
            debug: props.debug,
            token: props.token,
            cardType: props.cardType,
            origins: props.origins,
            font: props.font,
        });
    }, [
        css,
        initializeCvvOnlyTokenExIframe,
        props.debug,
        props.token,
        props.cardType,
        props.origins,
        props.font,
    ]);
    return (0, react_1.useMemo)(function () { return react_1.default.createElement("div", { id: common_1.TokenExCvvContainerID }); }, []);
});
/**
 * Allows merchants to collect the CVV for an already tokenized card in a PCI-compliant way and receive the token with the CVV linked.
 *
 * Usage:
 * ```tsx
 *  const ref =  useRef<{getToken(): Promise<{token: string}>}>();
 *
 * <CoinflowCvvOnlyInput
 *   ref={ref}
 *   cardType={'visa'}
 *   token={'411111YJM5TX1111'}
 *   env={'sandbox'}
 *   debug={true}
 *   css={{
 *     base: 'font-family: Arial, sans-serif;padding: 0 8px;border: 1px solid rgba(0, 0, 0, 0.2);margin: 0;width: 100%;font-size: 13px;line-height: 30px;height: 32px;box-sizing: border-box;-moz-box-sizing: border-box;',
 *     focus:
 *       'box-shadow: 0 0 6px 0 rgba(0, 132, 255, 0.5);border: 1px solid rgba(0, 132, 255, 0.5);outline: 0;',
 *     error:
 *       'box-shadow: 0 0 6px 0 rgba(224, 57, 57, 0.5);border: 1px solid rgba(224, 57, 57, 0.5);',
 *     cvv: {
 *       base: 'font-family: Arial, sans-serif;padding: 0 8px;border: 1px solid rgba(0, 0, 0, 0.2);margin: 0;width: 100%;font-size: 13px;line-height: 30px;height: 32px;box-sizing: border-box;-moz-box-sizing: border-box;',
 *       focus:
 *         'box-shadow: 0 0 6px 0 rgba(0, 132, 255, 0.5);border: 1px solid rgba(0, 132, 255, 0.5);outline: 0;',
 *       error:
 *         'box-shadow: 0 0 6px 0 rgba(224, 57, 57, 0.5);border: 1px solid rgba(224, 57, 57, 0.5);',
 *     },
 *   }}
 * />
 *
 *  <button onClick={() => {
 *   ref.current?.getToken()
 *     .then(({token}) => console.log(token))
 *     .catch(e => console.error('GET TOKEN ERROR', e))
 *  }}>Get Token</button>
 *
 * ```
 */
exports.CoinflowCvvOnlyInput = (0, react_1.memo)(CoinflowCvvOnlyInputComponent);
var CoinflowCardOnlyInputComponent = (0, react_1.forwardRef)(function (props, ref) {
    var css = (0, react_1.useMemo)(function () {
        return JSON.stringify(props.css);
    }, [props.css]);
    var _a = (0, useCardFormIframe_1.useCardFormIframe)(props.env), tokenExIframe = _a.tokenExIframe, initializeTokenExCardOnlyIframe = _a.initializeTokenExCardOnlyIframe;
    (0, react_1.useImperativeHandle)(ref, function () { return ({
        getToken: function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    if (!tokenExIframe)
                        throw new Error('Unable to get token');
                    return [2 /*return*/, tokenExIframe.tokenize()];
                });
            });
        },
    }); });
    (0, react_1.useEffect)(function () {
        initializeTokenExCardOnlyIframe({
            css: css,
            debug: props.debug,
            origins: props.origins,
            font: props.font,
        });
    }, [
        initializeTokenExCardOnlyIframe,
        props.debug,
        css,
        props.origins,
        props.font,
    ]);
    return react_1.default.createElement("div", { id: common_1.TokenExCardNumberIframeId });
});
/**
 * Allows merchants to collect card information from their customers in a PCI-compliant way and receive the tokenized card number.
 * The `CoinflowCardOnlyInput` is used for collecting a debit card for users to be able to withdraw their funds directly to.
 *
 * Usage:
 * ```tsx
 *  const ref =  useRef<{getToken(): Promise<{token: string}>}>();
 *
 *  <CoinflowCardOnlyInput
 *   ref={ref}
 *   env={'sandbox'}
 *   debug={true}
 *   css={{
 *     base: 'font-family: Arial, sans-serif;padding: 0 8px;border: 1px solid rgba(0, 0, 0, 0.2);margin: 0;width: 100%;font-size: 13px;line-height: 30px;height: 32px;box-sizing: border-box;-moz-box-sizing: border-box;',
 *     focus:
 *       'box-shadow: 0 0 6px 0 rgba(0, 132, 255, 0.5);border: 1px solid rgba(0, 132, 255, 0.5);outline: 0;',
 *     error:
 *       'box-shadow: 0 0 6px 0 rgba(224, 57, 57, 0.5);border: 1px solid rgba(224, 57, 57, 0.5);',
 *     cvv: {
 *       base: 'font-family: Arial, sans-serif;padding: 0 8px;border: 1px solid rgba(0, 0, 0, 0.2);margin: 0;width: 100%;font-size: 13px;line-height: 30px;height: 32px;box-sizing: border-box;-moz-box-sizing: border-box;',
 *       focus:
 *         'box-shadow: 0 0 6px 0 rgba(0, 132, 255, 0.5);border: 1px solid rgba(0, 132, 255, 0.5);outline: 0;',
 *       error:
 *         'box-shadow: 0 0 6px 0 rgba(224, 57, 57, 0.5);border: 1px solid rgba(224, 57, 57, 0.5);',
 *     },
 *   }}
 * />
 *
 *  <button onClick={() => {
 *   ref.current?.getToken()
 *     .then(({token}) => console.log(token))
 *     .catch(e => console.error('GET TOKEN ERROR', e))
 *  }}>Get Token</button>
 *
 * ```
 */
exports.CoinflowCardOnlyInput = (0, react_1.memo)(CoinflowCardOnlyInputComponent);
//# sourceMappingURL=CoinflowCardForm.js.map