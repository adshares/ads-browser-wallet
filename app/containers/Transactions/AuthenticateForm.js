/* eslint-disable class-methods-use-this */
import React from 'react';
import SignForm from './SignForm';
import ADS from '../../utils/ads';
import * as types from '../../../app/constants/MessageTypes';
import { fieldLabels } from './labels';
import style from './SignForm.css';
import { stringToHex } from '../../utils/utils';

export default class AuthenticateForm extends SignForm {
  static parseCommand(transaction) {
    const command = {
      ...transaction,
      type: types.MSG_AUTHENTICATE,
    };
    return {
      command,
      dataError: !command.hostname,
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { accounts, keys, selectedAccount, accountsLoaded } = props.vault;
    const account = accounts.find(
      a => a.address === selectedAccount
    );
    let key = state.key;
    if (state.account && account && state.account.publicKey !== account.publicKey) {
      key = keys.find(
        k => k.publicKey === account.publicKey
      );
    }
    return { account, key, keyError: !key && accountsLoaded, };
  }

  getCommand() {
    const { transaction } = this.props;
    return AuthenticateForm.parseCommand(transaction);
  }

  renderCommand(type, fields) {
    switch (type) {
      case types.MSG_AUTHENTICATE:
        return '';
      default:
        return super.renderCommand(type, fields);
    }
  }

  renderInfo(commnad) {
    const { account } = this.state;
    const name = account.name ? `(${account.name})` : '';
    return (
      <React.Fragment>
        <h1>Authentication<br /><small>on <i>{commnad.hostname}</i></small></h1>
        <p className={style.info}>
          Do you want to pass information about account<br /> <b>{account.address}</b> {name}<br /> to the website <b>{commnad.hostname || 'unknown'}</b>?
        </p>
      </React.Fragment>
    );
  }

  renderAdvancedFields(command) {
    return (
      <React.Fragment>
        {command.hostname ? <tr>
          <td>{fieldLabels.hostname}</td>
          <td>{command.hostname}</td>
        </tr> : '' }
        {command.nonce ? <tr>
          <td>{fieldLabels.nonce}</td>
          <td><code>{command.nonce}</code></td>
        </tr> : '' }
      </React.Fragment>
    );
  }

  prepareResponse(state) {
    const { command, account, key } = state;
    const signature = ADS.sign(
      stringToHex(`message:${command.nonce}`),
      key.publicKey,
      key.secretKey
    );
    const { address, publicKey, balance, messageId, hash } = account;
    return { signature, account: { address, publicKey, balance, messageId, hash } };
  }
}
