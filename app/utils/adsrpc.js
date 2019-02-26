import parser from 'jsonrpc-lite/jsonrpc';
import { uuidv4 } from './utils';
import ADS from './ads';
import { RpcError } from '../actions/errors';

export default class {
  constructor(host) {
    this.host = host;
  }

  send(data) {
    return fetch(this.host, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
  }

  request(method, params) {
    return this.send(parser.request(uuidv4(), method, params))
      .then(response => response.json(), (error) => {
        throw new RpcError('RPC Server Communication Error', error);
      })
      .then((response) => {
        if (response.error) {
          throw new RpcError(
            response.error.data ?
              `${response.error.message} - ${response.error.data}.` :
              response.error.message,
            response.error
          );
        }
        return response.result;
      }, (error) => {
        throw new RpcError('RPC Server Malformed Data Error', error);
      });
  }

  getAccount(address) {
    return this.request(
      ADS.TX_TYPES.GET_ACCOUNT, {
        address
      }
    ).then((response) => {
      if (!response || !response.account) {
        throw new RpcError('RPC Server Response Error', response);
      }
      return {
        address: response.account.address,
        balance: response.account.balance,
        hash: response.account.hash,
        messageId: parseInt(response.account.msid, 10),
        publicKey: response.account.public_key,
        status: parseInt(response.account.status, 10),
      };
    });
  }

  getNodes() {
    return this.request(
      ADS.TX_TYPES.GET_BLOCK, {
        block: ''
      }
    ).then((response) => {
      if (!response || !response.block || !response.block.nodes) {
        throw new RpcError('RPC Server Response Error', response);
      }
      return response.block.nodes.map(node => ({
        id: node.id,
        ipv4: node.ipv4,
        port: parseInt(node.port, 10),
        status: parseInt(node.status, 10),
      })).filter(node => node.ipv4 !== '0.0.0.0');
    });
  }

  createFreeAccount(publicKey, confirm) {
    return this.request(
      'create_free_account', {
        public_key: publicKey,
        confirm,
      }
    ).then((response) => {
      if (!response || !response.new_account || !response.new_account.address) {
        throw new RpcError('RPC Server Response Error', response);
      }
      return response.new_account.address;
    });
  }

  sendTransaction(data, signature, host) {
    return this.request(
      ADS.TX_TYPES.SEND_AGAIN, {
        data,
        signature,
        _host: host
      }
    ).then((response) => {
      if (!response || !response.tx) {
        throw new RpcError('RPC Server Response Error', response);
      }
      return {
        id: response.tx.id,
        fee: response.tx.fee,
        accountHash: response.tx.account_hashout,
        accountMessageId: response.tx.account_msid,
      };
    });
  }
}
