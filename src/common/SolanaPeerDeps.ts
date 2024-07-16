// This works in angular, but not react
// let web3: typeof import('@solana/web3.js') | undefined;
// let base58: typeof import('bs58') | undefined;
//
// try {
//   web3 = require('@solana/web3.js');
//   base58 = require('bs58');
// } catch (e) {}
//
// export {web3, base58};

// This works in react, but not angular
import * as SolanaWeb3Js from '@solana/web3.js';
import base58Imported from 'bs58';

const web3: typeof SolanaWeb3Js | undefined = SolanaWeb3Js;
const base58: typeof base58Imported | undefined = base58Imported;
export {web3, base58};
