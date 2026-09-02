# Changelog

## 5.22.1

- Fix the `amount` prop on `CoinflowWithdraw` never reaching the iframe URL, which made the widget show the full wallet balance instead of the supplied amount. `amount` is now passed through alongside `lockAmount`.

## 5.22.0

- `CoinflowApplePayButton` and `CoinflowGooglePayButton` no longer reload the iframe when the `subtotal` prop changes. The amount is now sent to the running iframe via `postMessage`, so the button stays mounted and updates instantly.
- Add an optional `onLoad` callback to `CoinflowApplePayButton` and `CoinflowGooglePayButton`, fired once the button inside the iframe has loaded. Useful for showing the button as disabled/dimmed until it is ready.
- Add an optional `useNativeSubtotal` prop to `CoinflowApplePayButton`. When true, the Apple Pay button skips the totals (fee quote) fetch and charges exactly the `subtotal` passed to the component.

## 5.21.1

- Fix an unhandled `TypeError: n.startsWith is not a function` on Chrome Mobile iOS in `CoinflowGooglePayButton` and other iframe-based components. `message` event handlers now ignore non-string `postMessage` payloads instead of crashing.

## 5.18.0

- Add a skeleton loader to the V2 card forms (`CoinflowCardForm`, `CoinflowCardNumberForm`, `CoinflowCvvForm`). The skeleton occupies the same space as the rendered form to prevent layout shift and disappears once the form is ready for input, removing the blank state during load.
