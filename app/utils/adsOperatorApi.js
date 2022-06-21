import { RpcError } from '../actions/errors';
import config from '../config/config';
import { formatIsoDate } from './utils';

export default class AdsOperatorApi {
  host = config.operatorApiUrl
  send(path) {
    const url = `${this.host}api/v1/${path}`;
    return fetch(url);
  }

  request(path) {
    return this.send(path)
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
        return response.rate;
      }, (error) => {
        throw new RpcError('RPC Server Malformed Data Error', error);
      });
  }

  getCurrencyExchangeCourse() {
    const date = new Date();
    date.setHours(date.getHours() - 1);
    const path = `exchange-rate/${formatIsoDate(date)}/USD`;
    return this.request(path).then((response) => {
      if (!response) {
        throw new RpcError('RPC Server Response Error', response);
      }
      return response;
    });
  }
}

