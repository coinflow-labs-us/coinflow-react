"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoinflowIFrame = void 0;
exports.useRandomHandleHeightChangeId = useRandomHandleHeightChangeId;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var common_1 = require("./common");
function useRandomHandleHeightChangeId() {
    return (0, react_1.useMemo)(function () { return Math.random().toString(16).substring(2); }, []);
}
exports.CoinflowIFrame = (0, react_1.forwardRef)(function (props, ref) {
    var IFrameRef = (0, react_1.useRef)(null);
    var url = (0, react_1.useMemo)(function () {
        return common_1.CoinflowUtils.getCoinflowUrl(props);
    }, [props]);
    var sendMessage = (0, react_1.useCallback)(function (message) {
        var _a;
        if (!((_a = IFrameRef === null || IFrameRef === void 0 ? void 0 : IFrameRef.current) === null || _a === void 0 ? void 0 : _a.contentWindow))
            throw new Error('Iframe not defined');
        IFrameRef.current.contentWindow.postMessage(message, '*');
    }, []);
    (0, react_1.useImperativeHandle)(ref, function () { return ({
        listenForMessage: function (isResponseValid) {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var handler;
                return tslib_1.__generator(this, function (_a) {
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            handler = function (_a) {
                                var data = _a.data, origin = _a.origin;
                                if (!origin.includes(common_1.CoinflowUtils.getCoinflowBaseUrl(props.env)))
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
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    sendMessage(message);
                    return [2 /*return*/, this.listenForMessage(isResponseValid)];
                });
            });
        },
    }); });
    var handleIframeMessages = (0, react_1.useCallback)(function (_a) {
        var data = _a.data, origin = _a.origin;
        if (!origin.includes(common_1.CoinflowUtils.getCoinflowBaseUrl(props.env)))
            return;
        var promise = (0, common_1.handleIFrameMessage)(data, props, props.handleHeightChangeId);
        if (!promise)
            return;
        promise.then(sendMessage).catch(function (e) { return sendMessage('ERROR ' + e.message); });
    }, [props, sendMessage]);
    (0, react_1.useEffect)(function () {
        if (!window)
            throw new Error('Window not defined');
        window.addEventListener('message', handleIframeMessages);
        return function () {
            window.removeEventListener('message', handleIframeMessages);
        };
    }, [handleIframeMessages]);
    (0, react_1.useLayoutEffect)(function () {
        if (!IFrameRef.current)
            return;
        // @ts-expect-error TypeScript doesn't recognize credentialless as a valid attribute in its type definitions yet
        IFrameRef.current.credentialless = true;
    }, []);
    var handleHeightChange = props.handleHeightChange;
    return (0, react_1.useMemo)(function () { return (react_1.default.createElement("iframe", { scrolling: handleHeightChange ? 'no' : 'yes', onLoad: function () {
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