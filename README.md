# Coinflow React

## Withdraw Usage
```
import {useWallet} from '@solana/wallet-adapter-react';
const wallet = useWallet();
const connection = useConnection();

<CoinflowWithdraw wallet={wallet} merchantId='<YOUR MERCHANT ID>' env='prod|sandbox|staging' connection={connection} />;
```

Props:
* `wallet`: The Solana Wallet Adapter Wallet
* `merchantId`: Your Merchant ID (Contact Coinflow support for this)
* `connection`: Solana Connection
* `env` (optional): This defaults to `prod`
    - For testing set to `staging`
* `onSuccess` (optional): function to run when the withdrawal process is successful
* `lockAmount` (optional): Whether to let the user select the amount to withdraw or to disable the input
* `amount` (optional): The amount to withdraw - required if `lockAmount=true`
* `tokens` (optional): Define a list to filter the available tokens
* `lockDefaultToken` (optional): Only allow the default token to be used
* `email` (optional): Set the default email to be used in entry fields
* `bankAccountLinkRedirect` (optional): The URL to be used for bank account setup
* `supportsVersionedTransactions` (optional): Instruct the system that versioned transactions are supported
* `additionalWallets` (optional): Define additional wallets to assign to the user

## Purchase Usage
```
import {useWallet} from '@solana/wallet-adapter-react';
const wallet = useWallet();
const connection = useConnection();

<CoinflowPurchase wallet={wallet} merchantId='<YOUR MERCHANT ID>' env='prod|sandbox|staging' connection={connection} />;
```

Props:
* `wallet`: The Solana Wallet Adapter Wallet
* `merchantId`: Your Merchant ID (Contact Coinflow support for this)
* `connection`: Solana Connection
* `env` (optional): This defaults to `prod`
  - For testing set to `staging`
* `onSuccess` (optional): function to run when the purchase process is successful
* `transaction` (optional): transaction for the user to run which redeems their credits with your smart contract. Create this transaction just like you would for a normal user who has USDC in their account.
* `partialSigners` (optional): Keypairs of Partial Signers to sign the transaction with, this is necessary when initializing new accounts as the new account Keypair must sign the transaction.
* `debugTx` (optional): Setting this to `true` will sign the transaction with the wallet, and send the transaction with no preflight checks allowing for easier debug of any issues.
* `token` (optional): The token to use for the purchase. Defaults to USDC. Currently only supported for the Solana Blockchain.
* `planCode` (optional): When a subscription is being purchased, the code of the subscription plan.
* `settlementType` (optional): The settlement method to use for the proceeds of a purchase. (Credits, USDC, or Bank)
* `amount` (optional): Fix the amount of purchase
* `webhookInfo` (optional): Product or transaction based information that you want transmitted when you receive webhooks regarding the purchase
* `email` (optional): Set the default email to use in email entry fields
* `chargebackProtectionData` (optional):
* `disableApplePay` (optional): Ability to disable Apple Pay
* `disableGooglePay` (optional): Ability to disable Google Pay
* `customerInfo` (optional): Additional information about the customer
* `supportsVersionedTransactions` (optional): Instruct the system that you support versioned transactions
* `rent` (optional, Solana only): Specify the blockchain rent amount to add to the total
* `nativeSolToConvert` (optional, Solana only): Specify the amount of native SOL to convert wSOL for the purchase

## Utils

`CoinflowUtils`

* `getFeePayer` - Return the `PublicKey` of the Coinflow Fee Payer

# Changelog

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
