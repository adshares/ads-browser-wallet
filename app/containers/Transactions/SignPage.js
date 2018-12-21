import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons/index';
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
import { typeLabels, fieldLabels } from './labels';
import style from './SignPage.css';

export default class SignPage extends FormComponent {
  constructor(props) {
    super(props);

    const { source, id } = this.props.match.params;
    const message = this.props.queue.find(t =>
      t.type === 'sign' &&
      t.sourceId === source &&
      t.id === id
    );

    this.state = {
      source,
      id,
      message,
      showAdvanced: true,
      isSubmitted: false,
    };
  }

  handleAccept = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.setState({
      isSubmitted: true
    }, () => {
      const signature = 'xyz';

      BgClient.sendResponse(
        this.state.message.sourceId,
        this.state.message.id,
        {
          status: 'accepted',
          signature,
        },
      );
      this.props.history.push(this.getReferrer());
    });
  }

  handleReject = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.setState({
      isSubmitted: true
    }, () => {
      BgClient.sendResponse(
        this.state.message.sourceId,
        this.state.message.id,
        { status: 'rejected' },
      );
      this.props.history.push(this.getReferrer());
    });
  }

  renderSendMany(fields) {
    return (
      <React.Fragment>
        <tr>
          <td>{fieldLabels.sender}</td>
          <td>{fields.sender}</td>
        </tr>
        <tr>
          <td colSpan="2">{fieldLabels.wireCount} ({fields.wireCount}):</td>
        </tr>
        <tr className={style.wires}>
          <td colSpan="2">
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>{fieldLabels.address}</th>
                  <th>{fieldLabels.amount}</th>
                </tr>
              </thead>
              <tbody>{fields.wires.map((recipient, index) =>
                <tr key={recipient.address}>
                  <td>{index + 1}</td>
                  <td>{recipient.address}</td>
                  <td>{recipient.amount}</td>
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
          <tr key={k}>
            <td>{fieldLabels[k] || k}</td>
            <td>{fields[k]}</td>
          </tr>
        )}
      </React.Fragment>
    );
  }

  renderCommand(type, fields) {
    switch (type) {
      case 'broadcast':
      case 'send_one':
      case 'send_many':
        return this.renderSendMany(fields);
      case 'create_account':
      case 'create_node':
      case 'retrieve_funds':
      case 'change_account_key':
      case 'change_node_key':
      case 'set_account_status':
      case 'set_node_status':
      case 'unset_account_status':
      case 'unset_node_status':
      case 'log_account':
      default:
        return this.renderFields(fields);
    }
  }

  toggleAdvanced = (visible) => {
    this.setState({ showAdvanced: visible });
  }

  renderAdvanced(type, time, messageId, hash) {
    if (!this.state.showAdvanced) {
      return '';
    }
    return (
      <React.Fragment>
        <tr>
          <td>{fieldLabels.type}</td>
          <td>{typeLabels[type]} ({type})</td>
        </tr>
        {time ? <tr>
          <td>{fieldLabels.time}</td>
          <td>{time.toUTCString()}</td>
        </tr> : '' }
        <tr>
          <td>{fieldLabels.messageId}</td>
          <td>{messageId || '---'}</td>
        </tr>
        <tr>
          <td>{fieldLabels.hash}</td>
          <td><code>{hash || '---'}</code></td>
        </tr>
      </React.Fragment>
    );
  }

  renderSignForm(transaction, command, key) {
    const { type, time, messageId, ...rest } = command;

    return (
      <Form>
        <table className={style.fields}>
          <tbody>
            {this.renderCommand(type, rest)}
            <tr className={style.showAdvanced}>
              <td colSpan="2">
                <Checkbox checked={this.state.showAdvanced} desc="Show advanced" handleChange={this.toggleAdvanced} />
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
        subTitle={`from ${sender}`}
        cancelLink={this.getReferrer()}
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
