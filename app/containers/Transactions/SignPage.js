import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons/index';
import { TransactionDataError } from '../../actions/errors';
import FormComponent from '../../components/FormComponent';
import Page from '../../components/Page/Page';
import ErrorPage from '../ErrorPage';
import LoaderOverlay from '../../components/atoms/LoaderOverlay';
import Form from '../../components/atoms/Form';
import Button from '../../components/atoms/Button';
import Checkbox from '../../components/atoms/checkbox';
import BgClient from '../../utils/background';
import ADS from '../../utils/ads';
import { formatDate } from '../../utils/utils';
import { typeLabels, fieldLabels } from './labels';
import config from '../../config/config';
import style from './SignPage.css';

export default class SignPage extends FormComponent {
  constructor(props) {
    super(props);

    const { action, source, id } = this.props.match.params;
    console.debug(config, this.props.queue);
    const message = this.props.queue.find(t =>
      !!config.testnet === !!t.testnet &&
      t.type === 'sign' &&
      t.sourceId === source &&
      t.id === id
    );

    this.state = {
      source,
      id,
      message,
      showAdvanced: false,
      isSubmitted: false,
      popup: action === 'popup-sign',
    };
  }

  toggleAdvanced = (visible) => {
    this.setState({ showAdvanced: visible });
  }

  sendResponse = (status, signature) => {
    BgClient.sendResponse(
      this.state.message.sourceId,
      this.state.message.id,
      { status, signature },
    );
    if (this.state.popup) {
      chrome.tabs.getCurrent((tab) => {
        chrome.tabs.remove(tab.id);
      });
    } else {
      this.props.history.push(this.getReferrer());
    }
  }

  handleAccept = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.setState({
      isSubmitted: true
    }, () => {
      const signature = 'xyz';
      this.sendResponse('accepted', signature);
    });
  }

  handleReject = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.setState({
      isSubmitted: true
    }, () => {
      this.sendResponse('rejected');
    });
  }

  renderCommand(type, fields) {
    switch (type) {
      case 'broadcast':
        return this.renderBroadcast(fields);
      case 'send_one':
        return this.renderSendOne(fields);
      case 'send_many':
        return this.renderSendMany(fields);
      default:
        return this.renderFields(fields);
    }
  }

  renderAddress(address, label = fieldLabels.address) {
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
    const addresslink = `${config.operatorUrl}blockexplorer/accounts/`;
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
                    <a href={`${addresslink}${recipient.address}`} target="_blank" rel="noopener noreferrer">
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

  renderAdvanced(type, time, messageId, hash) {
    if (!this.state.showAdvanced) {
      return '';
    }
    const docLink = `${config.apiDocUrl}${type}`;
    return (
      <React.Fragment>
        <tr>
          <td>{fieldLabels.type}</td>
          <td>
            {typeLabels[type]}<br />
            <a href={docLink} target="_blank" rel="noopener noreferrer"><small>
              {type}<FontAwesomeIcon icon={faExternalLinkAlt} />
            </small></a>
          </td>
        </tr>
        {time ? <tr>
          <td>{fieldLabels.time}</td>
          <td title={formatDate(time, true, true)}>{formatDate(time)}</td>
        </tr> : '' }
        {messageId ? <tr>
          <td>{fieldLabels.messageId}</td>
          <td>{messageId}</td>
        </tr> : '' }
        {hash ? <tr>
          <td>{fieldLabels.hash}</td>
          <td><code>{hash}</code></td>
        </tr> : '' }
      </React.Fragment>
    );
  }

  renderSignForm(transaction, command, key) {
    const { type, sender, time, messageId, ...rest } = command;

    return (
      <Form>
        <table className={style.fields}>
          <tbody>
            {this.renderAddress(sender, fieldLabels.sender)}
            {this.renderCommand(type, rest)}
            <tr className={style.showAdvanced}>
              <td colSpan="2">
                <Checkbox
                  checked={this.state.showAdvanced}
                  desc="Show advanced data"
                  handleChange={this.toggleAdvanced}
                />
              </td>
            </tr>
            {this.renderAdvanced(type, time, messageId, transaction.hash)}
          </tbody>
        </table>
        <div className={style.buttons}>
          <Button type="reset" layout="danger" onClick={this.handleReject}>
            <FontAwesomeIcon icon={faTimes} /> Reject
          </Button>
          <Button type="submit" layout="success" onClick={this.handleAccept}>
            <FontAwesomeIcon icon={faCheck} /> Accept
          </Button>
        </div>
      </Form>
    );
  }

  renderErrorPage(code, message) {
    return (
      <ErrorPage
        code={code}
        message={message}
        cancelLink={this.getReferrer()}
      />
    );
  }

  render() {
    if (!this.state.message) {
      return this.renderErrorPage(404, `Cannot find message ${this.state.id}`);
    }
    const transaction = this.state.message.data;
    console.log(transaction);

    if (!transaction || !transaction.data) {
      return this.renderErrorPage(400, 'Malformed transaction data');
    }

    let command;
    try {
      command = ADS.decodeCommand(transaction.data);
    } catch (err) {
      if (err instanceof TransactionDataError) {
        return this.renderErrorPage(400, 'Malformed transaction data');
      }
      throw err;
    }
    const { type, sender } = command;
    console.log(command);

    let key;
    console.log(key);

    return (
      <Page
        className={style.page}
        title={typeLabels[type] || type}
        subTitle={`${sender}`}
        cancelLink={this.getReferrer()}
        noLinks={this.state.popup}
      >
        {this.state.isSubmitted && <LoaderOverlay />}
        {this.renderSignForm(transaction, command, key)}
      </Page>
    );
  }
}

SignPage.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  queue: PropTypes.array.isRequired,
  // signAction: PropTypes.func.isRequired,
};
