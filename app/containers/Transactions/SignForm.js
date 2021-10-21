/* eslint-disable class-methods-use-this */
import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faExternalLinkAlt, faTimes } from '@fortawesome/free-solid-svg-icons/index';
import { TransactionDataError } from '../../actions/errors';
import FormComponent from '../../components/FormComponent';
import Page from '../../components/Page/Page';
import Form from '../../components/atoms/Form';
import Button from '../../components/atoms/Button';
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
      showKeySelector: false,
      showAdvanced: false,
      ...this.parseCommand(transaction),
    };
  }

  parseCommand(transaction) {
    let command;
    let key;

    if (transaction && transaction.data && typeof transaction.data === 'string') {
      try {
        command = ADS.decodeCommand(transaction.data);
        key = this.findKey(command.sender, transaction.publicKey);
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
      keyError: !key && transaction.publicKey,
      showKeySelector: !key,
    };
  }

  findKey(sender, publicKey) {
    const { keys, accounts } = this.props.vault;
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

  handleKeySelect = (event) => {
    let key = null;
    if (event.target.value) {
      key = this.props.vault.keys.find(k => k.publicKey === event.target.value);
    }
    this.setState({ key });
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

  renderInfo() {
    return '';
  }

  renderCommand(type, fields) {
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
          {address}<FontAwesomeIcon icon={faExternalLinkAlt} />
        </a></td>
      </tr>
    );
  }

  renderNodeId(nodeId, label = fieldLabels.nodeId) {
    const link = `${config.operatorUrl}blockexplorer/nodes/${nodeId}`;
    return (
      <tr>
        <td>{label}</td>
        <td><a href={link} target="_blank" rel="noopener noreferrer">
          {nodeId}<FontAwesomeIcon icon={faExternalLinkAlt} />
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
          {blockId}<FontAwesomeIcon icon={faExternalLinkAlt} />
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
          {transactionId}<FontAwesomeIcon icon={faExternalLinkAlt} />
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
                      {recipient.address}<FontAwesomeIcon icon={faExternalLinkAlt} />
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
                      <td>{fieldLabels[k] || k}</td>
                      <td><code>{fields[k]}</code></td>
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
    const { type, time } = command;
    const docLink = `${config.apiDocUrl}${type}`;
    return (
      <React.Fragment>
        <tr>
          <td>{fieldLabels.type}</td>
          <td>
            {typeLabels[type]}{this.props.showDoc ? <React.Fragment><br />
              <a href={docLink} target="_blank" rel="noopener noreferrer"><small>
                {type}<FontAwesomeIcon icon={faExternalLinkAlt} />
              </small></a></React.Fragment> : ''}
          </td>
        </tr>
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

  renderKeySelector(keys, key) {
    if (!keys || keys.length === 0) {
      return null;
    }

    return (
      <tr className={style.keys}>
        <td>Key</td>
        <td>
          <select name="key" value={key ? key.publicKey : ''} required onChange={this.handleKeySelect}>
            <option>Select key</option>
            {keys.filter(k => k.publicKey).map(k => (
              <option key={k.publicKey} value={k.publicKey}>
                {k.name}: {k.publicKey.substr(0, 8)}…{k.publicKey.substr(k.publicKey.length - 8)}
              </option>
            ))}
          </select>
        </td>
      </tr>
    );
  }

  renderSignForm(transaction, command, key, keys) {
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
            {this.renderKeySelector(keys, key)}
          </tbody>
        </table>
        <div className={style.buttons}>
          <Button type="reset" layout="danger" onClick={this.handleReject}>
            <FontAwesomeIcon icon={faTimes} /> Reject
          </Button>
          <Button type="submit" layout="success" onClick={this.handleAccept} disabled={keys && !key}>
            <FontAwesomeIcon icon={faCheck} /> Accept
          </Button>
        </div>
      </Form>
    );
  }

  renderDataErrorPage() {
    return this.renderErrorPage(
      400,
      'Malformed transaction data',
      this.props.cancelLink,
      this.handleCancelClick
    );
  }

  renderKeyErrorPage() {
    return this.renderErrorPage(
      400,
      'Cannot find a key in storage. Please import secret key first.',
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

    const keys = this.state.showKeySelector ? this.props.vault.keys : null;
    const { type, sender } = command;

    return (
      <Page
        className={style.page}
        title={this.props.showTitle ? typeLabels[type] || type : null}
        subTitle={this.props.showTitle ? `${sender}` : null}
        cancelLink={this.props.cancelLink}
        onCancelClick={this.handleCancelClick}
        noLinks={this.props.noLinks}
        showLoader={this.props.showLoader}
      >
        {this.renderSignForm(transaction, command, key, keys)}
      </Page>
    );
  }
}

SignForm.propTypes = {
  transaction: PropTypes.object.isRequired,
  vault: PropTypes.object.isRequired,
  acceptAction: PropTypes.func.isRequired,
  rejectAction: PropTypes.func.isRequired,
  cancelLink: PropTypes.any,
  cancelAction: PropTypes.func,
  noLinks: PropTypes.bool,
  showLoader: PropTypes.bool,
  showTitle: PropTypes.bool,
  showDoc: PropTypes.bool,
};
