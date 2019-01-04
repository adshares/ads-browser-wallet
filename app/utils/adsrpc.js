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
          throw new RpcError(response.error.message, response.error.data);
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
        throw new RpcError('RPC Server Response Error');
      }
      return {
        address: response.account.address,
        balance: response.account.balance,
        hash: response.account.hash,
        messageId: response.account.msid,
        publicKey: response.account.public_key,
        status: response.account.status,
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
        throw new RpcError('RPC Server Response Error');
      }
      return response.block.nodes.map(node => ({
        id: node.id,
        ipv4: node.ipv4,
        port: node.port,
        status: node.status,
      })).filter(node => node.ipv4 !== '0.0.0.0');
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
        throw new RpcError('RPC Server Response Error');
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
