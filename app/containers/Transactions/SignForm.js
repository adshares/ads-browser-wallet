/* eslint-disable class-methods-use-this */
import React from 'react';
import PropTypes from 'prop-types';
import { TransactionDataError } from '../../actions/errors';
import FormComponent from '../../components/FormComponent';
import Page from '../../components/Page/Page';
import { LinkIcon } from '../../components/icons/Icons';
import Form from '../../components/atoms/Form';
import Button from '../../components/atoms/Button';
import Buttons from '../../components/atoms/Buttons';
import CheckboxControl from '../../components/atoms/CheckboxControl';
import ADS from '../../utils/ads';
import { formatDate } from '../../utils/utils';
import { fieldLabels, typeLabels } from './labels';
import config from '../../config/config';
import style from './SignForm.css';

export default class SignForm extends FormComponent {
  constructor(props) {
    super(props);
    const { transaction } = this.props;
    this.state = {
      transaction,
      command: null,
      dataError: false,
      account: null,
      key: null,
      keyError: false,
      showAdvanced: false,
      ...this.getCommand()
    };
  }

  static getDerivedStateFromProps(props) {
    const { transaction, vault } = props;
    return SignForm.parseCommand(transaction, vault);
  }

  static parseCommand(transaction, vault) {
    let command;
    let key;

    if (transaction && transaction.data && typeof transaction.data === 'string') {
      try {
        command = ADS.decodeCommand(transaction.data);
        key = SignForm.findKey(command.sender, transaction.publicKey, vault);
      } catch (err) {
        if (!(err instanceof TransactionDataError)) {
          throw err;
        }
      }
    }

    return {
      command,
      dataError: !command,
      key,
      keyError: !key,
    };
  }

  getCommand() {
    const { transaction, vault } = this.props;
    return SignForm.parseCommand(transaction, vault);
  }

  isGateway() {
    return this.props.extra && this.props.extra.gateway;
  }

  static findKey(sender, publicKey, vault) {
    const { keys, accounts } = vault;
    if (publicKey) {
      const key = keys.find(k => k.publicKey === publicKey);
      if (key) {
        return key;
      }
    }

    const account = accounts.find(a => a.address === sender);
    if (account) {
      const key = keys.find(k => k.publicKey === account.publicKey);
      if (key) {
        return key;
      }
    }

    return null;
  }

  prepareResponse(state) {
    const { transaction, key } = state;
    const signature = ADS.sign(
      transaction.hash + transaction.data,
      key.publicKey,
      key.secretKey
    );
    return { signature };
  }

  toggleAdvanced = (visible) => {
    this.setState({ showAdvanced: visible });
  };

  handleAccept = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.props.acceptAction(this.prepareResponse(this.state));
  };

  handleReject = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.props.rejectAction();
  };

  handleCancelClick = (event) => {
    if (this.props.cancelAction) {
      event.preventDefault();
      event.stopPropagation();
      this.props.cancelAction();
    }
  };

  getTitle(command) {
    if (!this.props.showTitle) {
      return null;
    }
    if (this.isGateway()) {
      return this.props.extra.gateway.name;
    }
    return typeLabels[command.type] || command.type;
  }

  getSubTitle(command) {
    if (!this.props.showTitle) {
      return null;
    }
    if (this.isGateway()) {
      return null;
    }
    return `${command.sender}`;
  }

  renderInfo() {
    return '';
  }

  renderCommand(type, fields) {
    if (this.isGateway()) {
      return this.renderGateway(fields);
    }
    switch (type) {
      case ADS.TX_TYPES.BROADCAST:
        return this.renderBroadcast(fields);
      case ADS.TX_TYPES.SEND_ONE:
        return this.renderSendOne(fields);
      case ADS.TX_TYPES.SEND_MANY:
        return this.renderSendMany(fields);
      default:
        return this.renderFields(fields);
    }
  }

  renderAddress(address, label = fieldLabels.address) {
    if (!address) {
      return;
    }
    const link = `${config.operatorUrl}blockexplorer/accounts/${address}`;
    return (
      <tr>
        <td>{label}</td>
        <td><a href={link} target="_blank" rel="noopener noreferrer">
          {address}<LinkIcon />
        </a></td>
      </tr>
    );
  }

  renderGatewayAddress(message, gateway, label = fieldLabels.address) {
    if (!message) {
      return;
    }

    const address = message.replace(gateway.prefix, '').toLowerCase();
    let link = null;
    let prefix = '';
    if (gateway.code === 'ETH') {
      link = `https://etherscan.io/address/0x${address}`;
    } else if (gateway.code === 'BSC') {
      link = `https://bscscan.com/address/0x${address}`;
    }

    if (gateway.format === 'eth') {
      prefix = '0x';
    }

    return (
      <tr>
        <td>{label}</td>
        <td>
          {link ?
            <a href={link} target="_blank" rel="noopener noreferrer">
              <code>{prefix}{address}</code><LinkIcon />
            </a> :
            <code>{prefix}{address}</code>
          }
        </td>
      </tr>
    );
  }

  renderNodeId(nodeId, label = fieldLabels.nodeId) {
    const link = `${config.operatorUrl}blockexplorer/nodes/${nodeId}`;
    return (
      <tr>
        <td>{label}</td>
        <td><a href={link} target="_blank" rel="noopener noreferrer">
          {nodeId}<LinkIcon />
        </a></td>
      </tr>
    );
  }

  renderBlockId(blockId, label = fieldLabels.blockId) {
    if (/^0+$/.test(blockId)) {
      return '';
    }
    const link = `${config.operatorUrl}blockexplorer/blocks/${blockId}`;
    return (
      <tr>
        <td>{label}</td>
        <td><a href={link} target="_blank" rel="noopener noreferrer">
          {blockId}<LinkIcon />
        </a></td>
      </tr>
    );
  }

  renderTransactionId(transactionId, label = fieldLabels.transactionId) {
    const link = `${config.operatorUrl}blockexplorer/transactions/${transactionId}`;
    return (
      <tr>
        <td>{label}</td>
        <td><a href={link} target="_blank" rel="noopener noreferrer">
          {transactionId}<LinkIcon />
        </a></td>
      </tr>
    );
  }

  renderMessage(message, label = fieldLabels.message, renderEmpty = false) {
    const msg = renderEmpty ? message : message.replace(/^0+/, '');
    if (msg.length === 0) {
      return '';
    }
    return (
      <tr>
        <td>{label}</td>
        <td><code title={ADS.decodeMessage(msg)}>{msg}</code></td>
      </tr>
    );
  }

  renderGateway(fields) {
    return (
      <React.Fragment>
        {this.renderGatewayAddress(fields.message, this.props.extra.gateway, fieldLabels.recipient)}
        <tr className={style.transferAdsAmount}>
          <td>{fieldLabels.amount}</td>
          <td>{ADS.formatClickMoney(fields.amount, 11, true)} ADS</td>
        </tr>
      </React.Fragment>
    );
  }

  renderBroadcast(fields) {
    return (
      <React.Fragment>
        <tr>
          <td>{fieldLabels.messageLength}</td>
          <td>{fields.messageLength}</td>
        </tr>
        {this.renderMessage(fields.message, fieldLabels.message, true)}
      </React.Fragment>
    );
  }

  renderSendOne(fields) {
    return (
      <React.Fragment>
        {this.renderAddress(fields.address, fieldLabels.recipient)}
        <tr>
          <td>{fieldLabels.amount}</td>
          <td>{ADS.formatClickMoney(fields.amount, 11, true)} ADS</td>
        </tr>
        {this.renderMessage(fields.message)}
      </React.Fragment>
    );
  }

  renderSendMany(fields) {
    const addressLink = `${config.operatorUrl}blockexplorer/accounts/`;
    return (
      <React.Fragment>
        <tr className={style.wires}>
          <td colSpan="2">
            <table>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>{fieldLabels.address}</th>
                  <th>{fieldLabels.amount}</th>
                </tr>
              </thead>
              <tbody>{fields.wires.map((recipient, index) =>
                <tr key={recipient.address}>
                  <td>{index + 1}</td>
                  <td>
                    <a href={`${addressLink}${recipient.address}`} target="_blank" rel="noopener noreferrer">
                      {recipient.address}<LinkIcon />
                    </a>
                  </td>
                  <td>{ADS.formatClickMoney(recipient.amount, 11, true)} ADS</td>
                </tr>
              )}</tbody>
            </table>
          </td>
        </tr>
      </React.Fragment>
    );
  }

  renderFields(fields) {
    return (
      <React.Fragment>
        {Object.keys(fields).map(k =>
          <React.Fragment key={k}>
            {(() => {
              switch (k) {
                case ADS.TX_FIELDS.ADDRESS:
                  return this.renderAddress(fields[k], fieldLabels[k] || k);
                case ADS.TX_FIELDS.NODE_ID:
                  return this.renderNodeId(fields[k], fieldLabels[k] || k);
                case ADS.TX_FIELDS.BLOCK_ID:
                case ADS.TX_FIELDS.BLOCK_ID_FROM:
                case ADS.TX_FIELDS.BLOCK_ID_TO:
                  return this.renderBlockId(fields[k], fieldLabels[k] || k);
                case ADS.TX_FIELDS.TRANSACTION_ID:
                  return this.renderTransactionId(fields[k], fieldLabels[k] || k);
                case ADS.TX_FIELDS.PUBLIC_KEY:
                case ADS.TX_FIELDS.VIP_HASH:
                  return (
                    <tr>
                      <td>{fieldLabels.vipHash}</td>
                      <td><code>{fields[k]}</code></td>
                    </tr>
                  );
                case ADS.TX_FIELDS.TIME:
                  return (
                    <tr>
                      <td>{fieldLabels.time}</td>
                      <td title={formatDate(fields[k], true, true)}>{formatDate(fields[k])}</td>
                    </tr>
                  );
                default:
                  return (
                    <tr>
                      <td>{fieldLabels[k] || k}</td>
                      <td>{fields[k]}</td>
                    </tr>
                  );
              }
            })()}
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }

  renderAdvanced(command, transaction, key) {
    if (!this.state.showAdvanced) {
      return '';
    }
    const { type, time, address, message } = command;
    const docLink = `${config.apiDocUrl}${type}`;
    return (
      <React.Fragment>
        <tr>
          <td>{fieldLabels.type}</td>
          <td>
            {typeLabels[type]}{this.props.showDoc ? <React.Fragment><br />
              <a href={docLink} target="_blank" rel="noopener noreferrer"><small>
                {type}<LinkIcon />
              </small></a></React.Fragment> : ''}
          </td>
        </tr>
        {this.isGateway() ? this.renderAddress(address, fieldLabels.gate) : ''}
        {this.isGateway() ? this.renderMessage(message) : ''}
        {time ? <tr>
          <td>{fieldLabels.time}</td>
          <td title={formatDate(time, true, true)}>{formatDate(time)}</td>
        </tr> : '' }
        {this.renderAdvancedFields(command, transaction)}
        {key ? <tr>
          <td>Public key</td>
          <td className={style.keyLabel}>
            <small>{key.name}</small>
            <code>{key.publicKey}</code>
          </td>
        </tr> : '' }
      </React.Fragment>
    );
  }

  renderAdvancedFields(command, transaction) {
    return (
      <React.Fragment>
        {command.messageId ? <tr>
          <td>{fieldLabels.messageId}</td>
          <td>{command.messageId}</td>
        </tr> : '' }
        {transaction.hash ? <tr>
          <td>{fieldLabels.hash}</td>
          <td><code>{transaction.hash}</code></td>
        </tr> : '' }
      </React.Fragment>
    );
  }

  renderSignForm(transaction, command, key) {
    const { type, sender, ...rest } = command;

    return (
      <Form>
        {this.renderInfo(command)}
        <table className={style.fields}>
          <tbody>
            {this.renderAddress(sender, fieldLabels.sender)}
            {this.renderCommand(type, rest)}
            <tr className={style.showAdvanced}>
              <td colSpan="2">
                <CheckboxControl
                  checked={this.state.showAdvanced}
                  label="Show advanced data"
                  handleChange={this.toggleAdvanced}
                />
              </td>
            </tr>
            {this.renderAdvanced(command, transaction, key)}
          </tbody>
        </table>
        <Buttons>
          <Button type="reset" layout="secondary" onClick={this.handleReject}>
            Cancel
          </Button>
          <Button type="submit" layout="primary" onClick={this.handleAccept}>
            Accept
          </Button>
        </Buttons>
      </Form>
    );
  }

  renderDataErrorPage() {
    return this.renderErrorPage(
      400,
      'Malformed transaction data',
      'Malformed data',
      this.props.cancelLink,
      this.handleCancelClick
    );
  }

  renderKeyErrorPage() {
    return this.renderErrorPage(
      400,
      'Cannot find the key in the storage. Please import the secret key first or change the account.',
      this.getTitle(this.state.command),
      this.props.cancelLink,
      this.handleCancelClick
    );
  }

  render() {
    const {
      transaction,
      command,
      dataError,
      key,
      keyError,
    } = this.state;

    if (dataError) {
      return this.renderDataErrorPage();
    }

    if (keyError) {
      return this.renderKeyErrorPage();
    }

    const showLoader = this.props.showLoader;

    return (
      <Page
        className={`${style.page} ${this.state.showAdvanced && scroll}`}
        title={this.getTitle(command)}
        subTitle={this.getSubTitle(command)}
        cancelLink={this.props.cancelLink}
        onCancelClick={this.handleCancelClick}
        noLinks={this.props.noLinks}
        showLoader={showLoader}
      >
        {this.renderSignForm(transaction, command, key)}
      </Page>
    );
  }
}

SignForm.propTypes = {
  transaction: PropTypes.object.isRequired,
  vault: PropTypes.object.isRequired,
  acceptAction: PropTypes.func.isRequired,
  rejectAction: PropTypes.func.isRequired,
  extra: PropTypes.object,
  cancelLink: PropTypes.any,
  cancelAction: PropTypes.func,
  noLinks: PropTypes.bool,
  showLoader: PropTypes.bool,
  showTitle: PropTypes.bool,
  showDoc: PropTypes.bool,
};
