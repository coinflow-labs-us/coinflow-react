import {
  CoinflowBlockchain,
  CoinflowEnvs,
  EthWallet,
  NearWallet,
  SolanaWallet,
} from './CoinflowUtils';
import type {Connection} from '@solana/web3.js';
import React from 'react';
import {PublicKey} from '@solana/web3.js';

export interface CommonCoinflowProps {
  merchantId: string;
  env?: CoinflowEnvs;
  loaderBackground?: string;
  blockchain: CoinflowBlockchain;
  handleHeightChange?: (height: string) => void;
}

export interface CoinflowSolanaHistoryProps extends CommonCoinflowProps {
  wallet: SolanaWallet;
  connection: Connection;
  blockchain: 'solana';
}

export interface CoinflowNearHistoryProps extends CommonCoinflowProps {
  wallet: NearWallet;
  blockchain: 'near';
}

export interface CoinflowEthHistoryProps extends CommonCoinflowProps {
  wallet: EthWallet;
  blockchain: 'eth';
}

export interface CoinflowPolygonHistoryProps extends CommonCoinflowProps {
  wallet: EthWallet;
  blockchain: 'polygon';
}

export interface CoinflowIFrameProps {
  walletPubkey: string;
  IFrameRef: React.RefObject<HTMLIFrameElement>;
  route: string;
  amount?: number;
  transaction?: string;
  blockchain: CoinflowBlockchain;
  webhookInfo?: object;
  token?: string | PublicKey;
  email?: string;
  env?: CoinflowEnvs;
  loaderBackground?: string;
  supportsVersionedTransactions?: boolean;
  handleHeightChange?: (height: string) => void;
}
