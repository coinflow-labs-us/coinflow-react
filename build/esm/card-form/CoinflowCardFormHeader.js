import { useEffect } from 'react';
import { useCardFormIframe } from './useCardFormIframe';
export function CoinflowCardFormHeader(_a) {
    var env = _a.env;
    var setTokenExScriptTag = useCardFormIframe(env).setTokenExScriptTag;
    useEffect(function () {
        setTokenExScriptTag();
    }, [setTokenExScriptTag]);
    return null;
}
//# sourceMappingURL=CoinflowCardFormHeader.js.map