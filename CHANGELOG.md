# Changelog

## 5.21.1

- Fix an unhandled `TypeError: n.startsWith is not a function` on Chrome Mobile iOS in `CoinflowGooglePayButton` and other iframe-based components. `message` event handlers now ignore non-string `postMessage` payloads instead of crashing.

## 5.18.0

- Add a skeleton loader to the V2 card forms (`CoinflowCardForm`, `CoinflowCardNumberForm`, `CoinflowCvvForm`). The skeleton occupies the same space as the rendered form to prevent layout shift and disappears once the form is ready for input, removing the blank state during load.
