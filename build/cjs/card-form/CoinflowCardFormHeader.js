"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
//# sourceMappingURL=CoinflowCardFormHeader.js.map