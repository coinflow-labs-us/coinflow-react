import { useEffect } from 'react';
import { useCardFormIframe } from './useCardFormIframe';
export function CoinflowCardFormHeader(props) {
    var setTokenExScriptTag = useCardFormIframe(props).setTokenExScriptTag;
    useEffect(function () {
        setTokenExScriptTag({ env: props.env, setTokenExScriptLoaded: function () { } });
    }, [props.env, setTokenExScriptTag]);
    return null;
}
//# sourceMappingURL=CoinflowCardFormHeader.js.map