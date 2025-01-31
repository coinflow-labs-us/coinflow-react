# Coinflow React

## Withdraw Usage

```
import {useWallet} from '@solana/wallet-adapter-react';
const wallet = useWallet();
const connection = useConnection();

<CoinflowWithdraw wallet={wallet} merchantId='<YOUR MERCHANT ID>' env='prod|sandbox|staging' connection={connection} />;
```

Props:

- `wallet`: The Solana Wallet Adapter Wallet
- `merchantId`: Your Merchant ID (Contact Coinflow support for this)
- `connection`: Solana Connection
- `env` (optional): This defaults to `prod`
  - For testing set to `staging`
- `onSuccess` (optional): function to run when the withdrawal process is successful
- `lockAmount` (optional): Whether to let the user select the amount to withdraw or to disable the input
- `amount` (optional): The amount to withdraw - required if `lockAmount=true`
- `tokens` (optional): Define a list to filter the available tokens
- `lockDefaultToken` (optional): Only allow the default token to be used
- `email` (optional): Set the default email to be used in entry fields
- `bankAccountLinkRedirect` (optional): The URL to be used for bank account setup
- `additionalWallets` (optional): Define additional wallets to assign to the user
- `usePermit` (optional): Pass as false to disable permit message signing for EVM and use approve transactions
- `transactionSigner` (optional): Public Key of the wallet which will actually execute the withdrawal transaction. Must be associated with the same withdrawer as the main wallet.

## Purchase Usage

```
import {useWallet} from '@solana/wallet-adapter-react';
const wallet = useWallet();
const connection = useConnection();

<CoinflowPurchase wallet={wallet} merchantId='<YOUR MERCHANT ID>' env='prod|sandbox|staging' connection={connection} />;
```

Props:

- `subtotal` (optional): Fix the amount of purchase
- `wallet`: The Solana Wallet Adapter Wallet
- `merchantId`: Your Merchant ID (Contact Coinflow support for this)
- `connection`: Solana Connection
- `env` (optional): This defaults to `prod`
  - For testing set to `staging`
- `onSuccess` (optional): function to run when the purchase process is successful
- `transaction` (optional): transaction for the user to run which redeems their credits with your smart contract. Create this transaction just like you would for a normal user who has USDC in their account.
- `debugTx` (optional): Setting this to `true` will sign the transaction with the wallet, and send the transaction with no preflight checks allowing for easier debug of any issues.
- `planCode` (optional): When a subscription is being purchased, the code of the subscription plan.
- `settlementType` (optional): The settlement method to use for the proceeds of a purchase. (Credits, USDC, or Bank)
- `webhookInfo` (optional): Product or transaction based information that you want transmitted when you receive webhooks regarding the purchase
- `email` (optional): Set the default email to use in email entry fields
- `chargebackProtectionData` (optional):
- `customerInfo` (optional): Additional information about the customer
- `allowedPaymentMethods` (optional): The payment methods displayed on the UI. If omitted, all available payment methods will be displayed.
- `rent` (optional, Solana only): Specify the blockchain rent amount to add to the total
- `nativeSolToConvert` (optional, Solana only): Specify the amount of native SOL to convert wSOL for the purchase
- `jwtToken` (optional): A JWT token which encodes verified checkout parameters to prevent spoofing of arguments.
- `supportEmail` (optional): Your business support email address to use for support inquiries

## Utils

`CoinflowUtils`

- `getFeePayer` - Return the `PublicKey` of the Coinflow Fee Payer

# Changelog

## 5.0.3

- Added `allowedPaymentMethods` to `CoinflowPurchase`
- Options are:
  - 'card' = Credit and debit cards
  - 'ach' = ACH bank account transfers
  - 'fasterPayments' = UK Faster Payments (GBP Bank Transfers)
  - 'sepa' = SEPA bank account transfers (EUR Bank Transfers)
  - 'pix' = Pix bank account transfers (BRL Bank Transfers)
  - 'usdc' = USDC
  - 'googlePay' = Google Pay
  - 'applePay' = Apple Pay
  - 'credits' = Credits

## 5.0.2

## 5.0.2

- Allow copy to clipboard for Coinflow Iframe

## 5.0.1

- Added `onAuthDeclined` callback to `CoinflowPurchase`

## 5.0.0

- Deprecating `amount` and `token` in favor of subtotal which can be accessed via the following ways:
- Added multi-currency support for presentment
- SEPA and UK Faster Payments support

```js
{
  cents: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'BRL';
}
```

or

```js
{
  address: string;
  amount: number;
}
```

## 4.5.2

- Updating optional peer dependencies to play nice with various bundlers

## 4.5.1

- Added sessionKey authentication mechanism to `CoinflowWithdraw`

## 4.5.0

- Added sessionKey authentication mechanism to `CoinflowPurchase`

## 4.4.1

- Added `onError` callback to Apple Pay and Google Pay buttons

## 4.4.0

- Added overlay to digital wallet buttons to make the loading time 0

## 4.3.1

- CoinflowPurchaseV2 component added for a modernized purchase flow

## 4.3.0

- Added arbitrum blockchain support

## 4.2.10

- Added `getWalletFromEmail` function to `CoinflowUtils`

## 4.2.9

- Added placeholder CSS to card form elements

## 4.2.8

- Custom fonts for card elements

## 4.2.5

- Allow custom taker on reservoir transactions

## 4.2.4

- Memoize styles on credit card inputs

## 4.1.0

- Add base blockchain support
- Added AuthOnly parameter to CoinflowPurchase

## 4.0.0

- Require `signMessage` on wallets for stronger withdraw authentication

## 3.1.11

- Added new ChargebackProtectionData productTypes

## 3.1.10

- Added `waitForHash` to EvmTransactionData

## 3.1.9

- Added `theme` props to Coinflow components for easy color control

## 3.1.8

- Added `orderId` option for reservoir items

## 3.1.7

- Added `nativeSolToConvert` for Solana transactions

## 3.1.5

- Settlement type param for settlement control

## 3.1.4

- Customer info param for added reporting capabilities

## 3.1.2

- Added disableGooglePay and disableApplePay props to CoinflowPurchase

## 3.1.1

- Added support for EVM NFT purchases

## 3.0.1

- Update to `CoinflowPurchaseProtection` to make `partnerId` required

### 3.0.0

**Breaking Changes**

- Added supportsVersionedTransactions to CoinflowWithdraw allowing platforms with wallets that support versioned transactions to Withdraw non-USDC/EuroE tokens in a single transaction with better prices.
- This is enabled to true by default. If you are using a wallet that does not support versioned transactions, you must set `supportsVersionedTransactions` in `CoinflowWithdraw` to `false`.

### 2.7.1

- Added new property lockDefaultToken which locks the withdrawal option to the users default currency (USDC or EUROe)

### 2.7.0

- Added support for paying solana rent for a transaction
- Added camera support document verification

### 2.6.1

- Added built in support for SSR which fixes a "window not defined" error.

### 2.6.0

- Added support for Apple Pay and Google Pay

### 2.5.0

- Added the `CoinflowCardForm` component which allows merchants to collect credit card information from their users in a PCI compliant way. Tokenize it, and then utilize the remainder of Coinflow's APIs.

### 2.4.0

- Added support for Ethereum Mainnet

### 2.3.2

- Added typing for `ChargebackProtectionData`
- Added `token` prop for `CoinflowPurchase` with polygon

### 2.3.0

Support Versioned Transactions in CoinflowPurchase

### 2.2.0

Added useSocket property to handle browser instances where iframe messages are unavailable

### 2.1.1

- Bug fix to set useHeightChange url param to true if using the handleHeightChange prop

### 2.1.0

- Added handleHeightChange to all components to allow for dynamic height changes

### 2.0.0

- Removing hard requirements for most large 3rd party libraries
- Improved type checking for wallets and transactions

### 1.3.0

- Added support for Polygon blockchain
- Added support for Solana Checkout with non-USDC tokens

### 1.2.0

- Added support for Ethereum Mainnet blockchain

### 1.0.0

- Added support for the NEAR blockchain

### 0.3.0

- Added Withdraw and Purchase history components

### 0.2.11

- Fixing bug with Magic Wallet and Versioned Transactions

### 0.2.9

- Added the ability to sign transactions

### 0.2.6,0.2.7

- Added `CoinflowUtils.getFeePayer()` to get the Coinflow fee payer PublicKey

### 0.2.5

- Fixing an issue when passing partialSigners not working with the setup transaction

### 0.2.4

- Setup and Redeem transactions now run gasless, which doesnt require the user to have SOL in their account to interact with coinflow

### 0.2.2,0.2.3

- Added the optional debugTx parameter to allow for easier debugging of any redeem transaction related issues.

### 0.2.1

- Added the optional partialSigners parameter to CoinflowPurchase component so redeem txs that require partial signers can be supported.

### 0.2.0

- Added the transaction optional parameter to CoinflowPurchase component enabling automatic redemption of credits on purchases.
