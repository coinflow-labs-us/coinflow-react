import { __awaiter, __generator } from "tslib";
import React, { forwardRef, memo, useEffect, useImperativeHandle, useMemo, } from 'react';
import { useCardFormIframe } from './useCardFormIframe';
import { TokenExCardNumberIframeId, TokenExCvvContainerID, } from '../common';
var CoinflowCardNumberInputComponent = forwardRef(function (props, ref) {
    var css = useMemo(function () {
        return JSON.stringify(props.css);
    }, [props.css]);
    var origins = JSON.stringify(props.origins);
    var _a = useCardFormIframe(props), tokenExIframe = _a.tokenExIframe, initializeTokenExIframe = _a.initializeTokenExIframe;
    useImperativeHandle(ref, function () { return ({
        getToken: function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (!tokenExIframe)
                        throw new Error('Unable to get token');
                    return [2 /*return*/, tokenExIframe.tokenize()];
                });
            });
        },
    }); });
    useEffect(function () {
        initializeTokenExIframe({
            css: css,
            debug: props.debug,
            origins: JSON.parse(origins),
            font: props.font,
        });
    }, [css, props.debug, props.font, origins, initializeTokenExIframe]);
    return React.createElement("div", { id: TokenExCardNumberIframeId });
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
 *     base: 'font-family: "Red Hat Display", sans-serif;padding: 0 8px;border: 1px solid rgba(0, 0, 0, 0.2);margin: 0;width: 100%;font-size: 13px;line-height: 30px;height: 32px;box-sizing: border-box;-moz-box-sizing: border-box;',
 *     focus:
 *       'box-shadow: 0 0 6px 0 rgba(0, 132, 255, 0.5);border: 1px solid rgba(0, 132, 255, 0.5);outline: 0;',
 *     error:
 *       'box-shadow: 0 0 6px 0 rgba(224, 57, 57, 0.5);border: 1px solid rgba(224, 57, 57, 0.5);',
 *     cvv: {
 *       base: 'font-family: "Red Hat Display", sans-serif;padding: 0 8px;border: 1px solid rgba(0, 0, 0, 0.2);margin: 0;width: 100%;font-size: 13px;line-height: 30px;height: 32px;box-sizing: border-box;-moz-box-sizing: border-box;',
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
export var CoinflowCardNumberInput = memo(CoinflowCardNumberInputComponent);
/**
 * The CVV number input for creating a new tokenized card
 */
export var CoinflowCvvInput = memo(function () { return React.createElement("div", { id: TokenExCvvContainerID }); });
var CoinflowCvvOnlyInputComponent = forwardRef(function (props, ref) {
    var css = useMemo(function () {
        return JSON.stringify(props.css);
    }, [props.css]);
    var origins = JSON.stringify(props.origins);
    var _a = useCardFormIframe(props), tokenExIframe = _a.tokenExIframe, initializeCvvOnlyTokenExIframe = _a.initializeCvvOnlyTokenExIframe;
    useImperativeHandle(ref, function () { return ({
        getToken: function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (!tokenExIframe)
                        throw new Error('Unable to get token');
                    return [2 /*return*/, tokenExIframe.tokenize()];
                });
            });
        },
    }); });
    useEffect(function () {
        initializeCvvOnlyTokenExIframe({
            css: css,
            debug: props.debug,
            token: props.token,
            cardType: props.cardType,
            origins: JSON.parse(origins),
            font: props.font,
        });
    }, [
        css,
        initializeCvvOnlyTokenExIframe,
        props.debug,
        props.token,
        props.cardType,
        origins,
        props.font,
    ]);
    return useMemo(function () { return React.createElement("div", { id: TokenExCvvContainerID }); }, []);
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
 *     base: 'font-family: "Red Hat Display", sans-serif;padding: 0 8px;border: 1px solid rgba(0, 0, 0, 0.2);margin: 0;width: 100%;font-size: 13px;line-height: 30px;height: 32px;box-sizing: border-box;-moz-box-sizing: border-box;',
 *     focus:
 *       'box-shadow: 0 0 6px 0 rgba(0, 132, 255, 0.5);border: 1px solid rgba(0, 132, 255, 0.5);outline: 0;',
 *     error:
 *       'box-shadow: 0 0 6px 0 rgba(224, 57, 57, 0.5);border: 1px solid rgba(224, 57, 57, 0.5);',
 *     cvv: {
 *       base: 'font-family: "Red Hat Display", sans-serif;padding: 0 8px;border: 1px solid rgba(0, 0, 0, 0.2);margin: 0;width: 100%;font-size: 13px;line-height: 30px;height: 32px;box-sizing: border-box;-moz-box-sizing: border-box;',
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
export var CoinflowCvvOnlyInput = memo(CoinflowCvvOnlyInputComponent);
var CoinflowCardOnlyInputComponent = forwardRef(function (props, ref) {
    var css = useMemo(function () {
        return JSON.stringify(props.css);
    }, [props.css]);
    var origins = JSON.stringify(props.origins);
    var _a = useCardFormIframe(props), tokenExIframe = _a.tokenExIframe, initializeTokenExCardOnlyIframe = _a.initializeTokenExCardOnlyIframe;
    useImperativeHandle(ref, function () { return ({
        getToken: function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (!tokenExIframe)
                        throw new Error('Unable to get token');
                    return [2 /*return*/, tokenExIframe.tokenize()];
                });
            });
        },
    }); });
    useEffect(function () {
        initializeTokenExCardOnlyIframe({
            css: css,
            debug: props.debug,
            origins: JSON.parse(origins),
            font: props.font,
        });
    }, [
        initializeTokenExCardOnlyIframe,
        props.debug,
        css,
        origins,
        props.font,
    ]);
    return React.createElement("div", { id: TokenExCardNumberIframeId });
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
 *     base: 'font-family: "Red Hat Display", sans-serif;padding: 0 8px;border: 1px solid rgba(0, 0, 0, 0.2);margin: 0;width: 100%;font-size: 13px;line-height: 30px;height: 32px;box-sizing: border-box;-moz-box-sizing: border-box;',
 *     focus:
 *       'box-shadow: 0 0 6px 0 rgba(0, 132, 255, 0.5);border: 1px solid rgba(0, 132, 255, 0.5);outline: 0;',
 *     error:
 *       'box-shadow: 0 0 6px 0 rgba(224, 57, 57, 0.5);border: 1px solid rgba(224, 57, 57, 0.5);',
 *     cvv: {
 *       base: 'font-family: "Red Hat Display", sans-serif;padding: 0 8px;border: 1px solid rgba(0, 0, 0, 0.2);margin: 0;width: 100%;font-size: 13px;line-height: 30px;height: 32px;box-sizing: border-box;-moz-box-sizing: border-box;',
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
export var CoinflowCardOnlyInput = memo(CoinflowCardOnlyInputComponent);
//# sourceMappingURL=CoinflowCardForm.js.map