import { useEffect } from 'react';
import { useCardFormIframe } from './useCardFormIframe';
export function CoinflowCardFormHeader(props) {
    const { setTokenExScriptTag } = useCardFormIframe(props);
    useEffect(() => {
        setTokenExScriptTag({ env: props.env, setTokenExScriptLoaded: () => { } });
    }, [props.env, setTokenExScriptTag]);
    return null;
}
/** @deprecated Use CoinflowCardForm instead — header is no longer needed */
export const CoinflowLegacyCardFormHeader = CoinflowCardFormHeader;
//# sourceMappingURL=CoinflowCardFormHeader.js.map