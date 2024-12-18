"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoinflowCardFormHeader = CoinflowCardFormHeader;
var react_1 = require("react");
var useCardFormIframe_1 = require("./useCardFormIframe");
function CoinflowCardFormHeader(props) {
    var setTokenExScriptTag = (0, useCardFormIframe_1.useCardFormIframe)(props).setTokenExScriptTag;
    (0, react_1.useEffect)(function () {
        setTokenExScriptTag({ env: props.env, setTokenExScriptLoaded: function () { } });
    }, [props.env, setTokenExScriptTag]);
    return null;
}
//# sourceMappingURL=CoinflowCardFormHeader.js.map