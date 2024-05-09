import { CoinflowPurchaseProps } from './common';
import React from "react";
export declare function CoinflowApplePayButton(props: CoinflowPurchaseProps & MobileWalletButtonProps): React.JSX.Element;
export declare function MobileWalletButton({ props, route }: {
    props: CoinflowPurchaseProps;
    route: string;
}): React.JSX.Element;
export interface MobileWalletButtonProps {
    color: "white" | "black";
}
