import { __awaiter, __generator } from "tslib";
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useRef, } from 'react';
import { CoinflowUtils, handleIFrameMessage, } from './common';
export function useRandomHandleHeightChangeId() {
    return useMemo(function () { return Math.random().toString(16).substring(2); }, []);
}
export var CoinflowIFrame = forwardRef(function (props, ref) {
    var IFrameRef = useRef(null);
    var url = useMemo(function () {
        return CoinflowUtils.getCoinflowUrl(props);
    }, [props]);
    var sendMessage = useCallback(function (message) {
        var _a;
        if (!((_a = IFrameRef === null || IFrameRef === void 0 ? void 0 : IFrameRef.current) === null || _a === void 0 ? void 0 : _a.contentWindow))
            throw new Error('Iframe not defined');
        IFrameRef.current.contentWindow.postMessage(message, '*');
    }, []);
    useImperativeHandle(ref, function () { return ({
        listenForMessage: function (isResponseValid) {
            return __awaiter(this, void 0, void 0, function () {
                var handler;
                return __generator(this, function (_a) {
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            handler = function (_a) {
                                var data = _a.data, origin = _a.origin;
                                if (!origin.includes(CoinflowUtils.getCoinflowBaseUrl(props.env)))
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
                        }).finally(function () {
                            window.removeEventListener('message', handler);
                        })];
                });
            });
        },
        sendAndReceiveMessage: function (message, isResponseValid) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    sendMessage(message);
                    return [2 /*return*/, this.listenForMessage(isResponseValid)];
                });
            });
        },
    }); });
    var handleIframeMessages = useCallback(function (_a) {
        var data = _a.data, origin = _a.origin;
        if (!origin.includes(CoinflowUtils.getCoinflowBaseUrl(props.env)))
            return;
        var promise = handleIFrameMessage(data, props, props.handleHeightChangeId);
        if (!promise)
            return;
        promise.then(sendMessage).catch(function (e) { return sendMessage('ERROR ' + e.message); });
    }, [props, sendMessage]);
    useEffect(function () {
        if (!window)
            throw new Error('Window not defined');
        window.addEventListener('message', handleIframeMessages);
        return function () {
            window.removeEventListener('message', handleIframeMessages);
        };
    }, [handleIframeMessages]);
    useLayoutEffect(function () {
        if (!IFrameRef.current)
            return;
        // @ts-expect-error TypeScript doesn't recognize credentialless as a valid attribute in its type definitions yet
        IFrameRef.current.credentialless = true;
    }, []);
    var handleHeightChange = props.handleHeightChange;
    return useMemo(function () { return (React.createElement("iframe", { scrolling: handleHeightChange ? 'no' : 'yes', onLoad: function () {
            if (IFrameRef.current)
                IFrameRef.current.style.opacity = '1';
        }, allow: 'payment;camera;clipboard-write', ref: IFrameRef, style: {
            width: '100%',
            height: '100%',
            opacity: 0,
            transition: 'opacity 300ms linear',
        }, title: "withdraw", frameBorder: "0", src: url })); }, [IFrameRef, handleHeightChange, url]);
});
//# sourceMappingURL=CoinflowIFrame.js.map