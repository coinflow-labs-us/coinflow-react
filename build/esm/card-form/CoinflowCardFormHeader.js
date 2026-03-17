import { useEffect } from 'react';
import { useCardFormIframe } from './useCardFormIframe';
export function CoinflowCardFormHeader(props) {
    const { setTokenExScriptTag } = useCardFormIframe(props);
    useEffect(() => {
        setTokenExScriptTag({ env: props.env, setTokenExScriptLoaded: () => { } });
    }, [props.env, setTokenExScriptTag]);
    return null;
}
//# sourceMappingURL=CoinflowCardFormHeader.js.map