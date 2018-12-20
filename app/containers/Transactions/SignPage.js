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
import BgClient from '../../utils/background';
import ADS from '../../utils/ads';
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

  renderSignForm(transaction) {
    // const tx = ADS.decodeTransaction(message.data.data)
    return (
      <Form>
        {transaction.id}
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
      } else {
        throw err;
      }
    }

    console.log(command);

    return (
      <Page className={style.page} title="Sign transaction" cancelLink={this.getReferrer()}>
        {this.state.isSubmitted && <LoaderOverlay />}
        {this.renderSignForm(transaction)}
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
