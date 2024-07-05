import {useEffect} from 'react';
import {useCardFormIframe} from './useCardFormIframe';
import {CoinflowEnvs} from '../common';

export function CoinflowCardFormHeader({env}: {env: CoinflowEnvs}) {
  const {setTokenExScriptTag} = useCardFormIframe(env);

  useEffect(() => {
    setTokenExScriptTag({env, setTokenExScriptLoaded: () => {}});
  }, [env, setTokenExScriptTag]);

  return null;
}
