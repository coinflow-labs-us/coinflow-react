"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoinflowLegacyCardFormHeader = void 0;
exports.CoinflowCardFormHeader = CoinflowCardFormHeader;
const react_1 = require("react");
const useCardFormIframe_1 = require("./useCardFormIframe");
function CoinflowCardFormHeader(props) {
    const { setTokenExScriptTag } = (0, useCardFormIframe_1.useCardFormIframe)(props);
    (0, react_1.useEffect)(() => {
        setTokenExScriptTag({ env: props.env, setTokenExScriptLoaded: () => { } });
    }, [props.env, setTokenExScriptTag]);
    return null;
}
/** @deprecated Use CoinflowCardForm instead — header is no longer needed */
exports.CoinflowLegacyCardFormHeader = CoinflowCardFormHeader;
//# sourceMappingURL=CoinflowCardFormHeader.js.map