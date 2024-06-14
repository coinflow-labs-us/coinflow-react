"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoinflowCardFormHeader = void 0;
var react_1 = require("react");
var useCardFormIframe_1 = require("./useCardFormIframe");
function CoinflowCardFormHeader(_a) {
    var env = _a.env;
    var setTokenExScriptTag = (0, useCardFormIframe_1.useCardFormIframe)(env).setTokenExScriptTag;
    (0, react_1.useEffect)(function () {
        setTokenExScriptTag();
    }, [setTokenExScriptTag]);
    return null;
}
exports.CoinflowCardFormHeader = CoinflowCardFormHeader;
//# sourceMappingURL=CoinflowCardFormHeader.js.map