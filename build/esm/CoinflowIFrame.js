import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useRef, } from 'react';
import { CoinflowUtils, handleIFrameMessage, } from './common';
export function useRandomHandleHeightChangeId() {
    return useMemo(() => Math.random().toString(16).substring(2), []);
}
export const CoinflowIFrame = forwardRef((props, ref) => {
    const IFrameRef = useRef(null);
    const url = useMemo(() => {
        return 'intentId' in props
            ? CoinflowUtils.getCoinflowIntentsUrl(props)
            : CoinflowUtils.getCoinflowUrl(props);
    }, [props]);
    const sendMessage = useCallback((message) => {
        if (!IFrameRef?.current?.contentWindow)
            throw new Error('Iframe not defined');
        IFrameRef.current.contentWindow.postMessage(message, '*');
    }, []);
    useImperativeHandle(ref, () => ({
        async listenForMessage(isResponseValid) {
            let handler;
            return new Promise((resolve, reject) => {
                handler = ({ data, origin }) => {
                    const expectedOrigin = new URL(CoinflowUtils.getCoinflowBaseUrl(props.env)).origin;
                    if (origin !== expectedOrigin)
                        return;
                    if (data.startsWith('ERROR')) {
                        reject(new Error(data.replace('ERROR', '')));
                        return;
                    }
                    if (!isResponseValid(data))
                        return;
                    resolve(data);
                };
                if (!window)
                    throw new Error('Window not defined');
                window.addEventListener('message', handler);
            }).finally(() => {
                window.removeEventListener('message', handler);
            });
        },
        async sendAndReceiveMessage(message, isResponseValid) {
            sendMessage(message);
            return this.listenForMessage(isResponseValid);
        },
    }));
    const handleIframeMessages = useCallback(({ data, origin }) => {
        const expectedOrigin = new URL(CoinflowUtils.getCoinflowBaseUrl(props.env)).origin;
        if (origin !== expectedOrigin)
            return;
        const promise = handleIFrameMessage(data, props, props.handleHeightChangeId);
        if (!promise)
            return;
        promise.then(sendMessage).catch(e => sendMessage('ERROR ' + e.message));
    }, [props, sendMessage]);
    useEffect(() => {
        if (!window)
            throw new Error('Window not defined');
        window.addEventListener('message', handleIframeMessages);
        return () => {
            window.removeEventListener('message', handleIframeMessages);
        };
    }, [handleIframeMessages]);
    useLayoutEffect(() => {
        if (!IFrameRef.current)
            return;
        // @ts-expect-error TypeScript doesn't recognize credentialless as a valid attribute in its type definitions yet
        IFrameRef.current.credentialless = true;
    }, []);
    const { handleHeightChange } = props;
    return useMemo(() => (React.createElement("iframe", { scrolling: handleHeightChange ? 'no' : 'yes', onLoad: () => {
            if (IFrameRef.current)
                IFrameRef.current.style.opacity = '1';
        }, allow: 'payment;camera;clipboard-write;geolocation', ref: IFrameRef, style: {
            width: '100%',
            height: '100%',
            opacity: 0,
            transition: 'opacity 300ms linear',
        }, title: "withdraw", frameBorder: "0", src: url })), [IFrameRef, handleHeightChange, url]);
});
//# sourceMappingURL=CoinflowIFrame.js.map