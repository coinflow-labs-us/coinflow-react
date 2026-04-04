import {useEffect} from 'react';
import {useCardFormIframe} from './useCardFormIframe';
import {CoinflowEnvs, MerchantIdOrCheckoutJwt} from '../common';

export function CoinflowCardFormHeader(
  props: {env: CoinflowEnvs} & MerchantIdOrCheckoutJwt
) {
  const {setTokenExScriptTag} = useCardFormIframe(props);

  useEffect(() => {
    setTokenExScriptTag({env: props.env, setTokenExScriptLoaded: () => {}});
  }, [props.env, setTokenExScriptTag]);

  return null;
}
