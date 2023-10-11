import {
  CoinflowPurchaseProps,
} from './CoinflowTypes';
import React from 'react';
import {MobileWalletButton, MobileWalletButtonProps} from './CoinflowApplePayButton';

export function CoinflowGooglePayButton(props: CoinflowPurchaseProps & MobileWalletButtonProps) {
  return <MobileWalletButton props={props} route={'google-pay'} />;
}
