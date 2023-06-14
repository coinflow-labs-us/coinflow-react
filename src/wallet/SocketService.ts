import io, {Socket} from 'socket.io-client';
import {CoinflowUtils} from '../CoinflowUtils';
import {CoinflowEnvs} from '../CoinflowTypes';

let socket: Socket | undefined;

export const initiateSocket = (walletPubkey: string, env?: CoinflowEnvs) => {
  if (!env) env = 'prod';
  const url = CoinflowUtils.getCoinflowApiUrl(env);
  socket = io(url, {
    auth: {
      wallet: walletPubkey,
    },
    transports: ['websocket'],
  });
  socket.on('connect', () => {
    console.log('Connected!');
  });
};
export const disconnectSocket = () => {
  console.log('Disconnecting socket...');
  if (socket) socket.disconnect();
  socket = undefined;
};

export const subscribeToChat = (cb: (message: string) => void) => {
  if (!socket) return;
  socket.on('message', msg => {
    cb(msg);
  });
};

export const sendWebsocketMessage = (message: string) => {
  if (socket) socket.emit('message', message);
};
