import React, {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useMemo,
} from 'react';
import {useCardFormIframe} from './useCardFormIframe';
import {
  CoinflowCardNumberInputProps,
  CoinflowCardTokenResponse,
  CoinflowCvvOnlyInputProps,
  TokenExCardNumberIframeId,
  TokenExCvvContainerID,
} from '../common';

const CoinflowCardNumberInputComponent = forwardRef(
  (props: CoinflowCardNumberInputProps, ref) => {
    const css = useMemo(() => {
      return JSON.stringify(props.css);
    }, [props.css]);

    const {tokenExIframe, initializeTokenExIframe} = useCardFormIframe(
      props.env
    );

    useImperativeHandle(ref, () => ({
      async getToken(): Promise<CoinflowCardTokenResponse> {
        if (!tokenExIframe) throw new Error('Unable to get token');
        return tokenExIframe.tokenize();
      },
    }));

    useEffect(() => {
      initializeTokenExIframe({
        css,
        debug: props.debug,
        origins: props.origins,
        fontFamily: props.font,
      });
    }, [initializeTokenExIframe, css, props.debug, props.origins, props.font]);

    return <div id={TokenExCardNumberIframeId} />;
  }
);

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
export const CoinflowCardNumberInput = memo(CoinflowCardNumberInputComponent);

/**
 * The CVV number input for creating a new tokenized card
 */
export const CoinflowCvvInput = memo(() => <div id={TokenExCvvContainerID} />);

const CoinflowCvvOnlyInputComponent = forwardRef(
  (props: CoinflowCvvOnlyInputProps, ref) => {
    const css = useMemo(() => {
      return JSON.stringify(props.css);
    }, [props.css]);

    const {tokenExIframe, initializeCvvOnlyTokenExIframe} = useCardFormIframe(
      props.env
    );

    useImperativeHandle(ref, () => ({
      async getToken(): Promise<CoinflowCardTokenResponse> {
        if (!tokenExIframe) throw new Error('Unable to get token');
        return tokenExIframe.tokenize();
      },
    }));

    useEffect(() => {
      initializeCvvOnlyTokenExIframe({
        css,
        debug: props.debug,
        token: props.token,
        cardType: props.cardType,
        origins: props.origins,
        fontFamily: props.font,
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

    return useMemo(() => <div id={TokenExCvvContainerID}></div>, []);
  }
);

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
export const CoinflowCvvOnlyInput = memo(CoinflowCvvOnlyInputComponent);

const CoinflowCardOnlyInputComponent = forwardRef(
  (props: CoinflowCvvOnlyInputProps, ref) => {
    const css = useMemo(() => {
      return JSON.stringify(props.css);
    }, [props.css]);

    const {tokenExIframe, initializeTokenExCardOnlyIframe} = useCardFormIframe(
      props.env
    );

    useImperativeHandle(ref, () => ({
      async getToken(): Promise<CoinflowCardTokenResponse> {
        if (!tokenExIframe) throw new Error('Unable to get token');
        return tokenExIframe.tokenize();
      },
    }));

    useEffect(() => {
      initializeTokenExCardOnlyIframe({
        css,
        debug: props.debug,
        origins: props.origins,
        fontFamily: props.font,
      });
    }, [
      initializeTokenExCardOnlyIframe,
      props.debug,
      css,
      props.origins,
      props.font,
    ]);

    return <div id={TokenExCardNumberIframeId} />;
  }
);

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
export const CoinflowCardOnlyInput = memo(CoinflowCardOnlyInputComponent);
