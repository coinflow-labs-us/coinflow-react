"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoinflowIFrame = void 0;
exports.useRandomHandleHeightChangeId = useRandomHandleHeightChangeId;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const common_1 = require("./common");
function useRandomHandleHeightChangeId() {
    return (0, react_1.useMemo)(() => Math.random().toString(16).substring(2), []);
}
exports.CoinflowIFrame = (0, react_1.forwardRef)((props, ref) => {
    const IFrameRef = (0, react_1.useRef)(null);
    const url = (0, react_1.useMemo)(() => {
        return common_1.CoinflowUtils.getCoinflowUrl(props);
    }, [props]);
    const sendMessage = (0, react_1.useCallback)((message) => {
        if (!IFrameRef?.current?.contentWindow)
            throw new Error('Iframe not defined');
        IFrameRef.current.contentWindow.postMessage(message, '*');
    }, []);
    (0, react_1.useImperativeHandle)(ref, () => ({
        async listenForMessage(isResponseValid) {
            let handler;
            return new Promise((resolve, reject) => {
                handler = ({ data, origin }) => {
                    const expectedOrigin = new URL(common_1.CoinflowUtils.getCoinflowBaseUrl(props.env)).origin;
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
    const handleIframeMessages = (0, react_1.useCallback)(({ data, origin }) => {
        const expectedOrigin = new URL(common_1.CoinflowUtils.getCoinflowBaseUrl(props.env)).origin;
        if (origin !== expectedOrigin)
            return;
        const promise = (0, common_1.handleIFrameMessage)(data, props, props.handleHeightChangeId);
        if (!promise)
            return;
        promise.then(sendMessage).catch(e => sendMessage('ERROR ' + e.message));
    }, [props, sendMessage]);
    (0, react_1.useEffect)(() => {
        if (!window)
            throw new Error('Window not defined');
        window.addEventListener('message', handleIframeMessages);
        return () => {
            window.removeEventListener('message', handleIframeMessages);
        };
    }, [handleIframeMessages]);
    (0, react_1.useLayoutEffect)(() => {
        if (!IFrameRef.current)
            return;
        // @ts-expect-error TypeScript doesn't recognize credentialless as a valid attribute in its type definitions yet
        IFrameRef.current.credentialless = true;
    }, []);
    const { handleHeightChange } = props;
    return (0, react_1.useMemo)(() => (react_1.default.createElement("iframe", { scrolling: handleHeightChange ? 'no' : 'yes', onLoad: () => {
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