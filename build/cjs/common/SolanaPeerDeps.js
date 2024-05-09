"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.base58 = exports.web3 = void 0;
var tslib_1 = require("tslib");
// This works in react, but not angular
var SolanaWeb3Js = tslib_1.__importStar(require("@solana/web3.js"));
var bs58_1 = tslib_1.__importDefault(require("bs58"));
var web3 = SolanaWeb3Js;
exports.web3 = web3;
var base58 = bs58_1.default;
exports.base58 = base58;
//# sourceMappingURL=SolanaPeerDeps.js.map