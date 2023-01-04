/* eslint-disable class-methods-use-this */
import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faExclamation,
  faLink,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import ADS from '../../utils/ads';
import config from '../../config/config';
import { prepareCommand } from '../../epics/transactionEpics';
import PageComponent from '../../components/PageComponent';
import Page from '../../components/Page/Page';
import Box from '../../components/atoms/Box';
import Form from '../../components/atoms/Form';
import ButtonLink from '../../components/atoms/ButtonLink';
import Button from '../../components/atoms/Button';
import Buttons from '../../components/atoms/Buttons';
import SignForm from './SignForm';
import { typeLabels } from './labels';
import style from './style.css';
import * as types from '../../constants/MessageTypes';

export default class TransactionPage extends PageComponent {
  static propTypes = {
    vault: PropTypes.object.isRequired,
    isSignRequired: PropTypes.bool.isRequired,
    isSubmitted: PropTypes.bool.isRequired,
    isTransactionSent: PropTypes.bool.isRequired,
    accountHash: PropTypes.string,
    transactionData: PropTypes.string,
    transactionId: PropTypes.string,
    transactionFee: PropTypes.string,
    errorMsg: PropTypes.string,
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    queue: PropTypes.array,
    actions: PropTypes.shape({
      initMessageForm: PropTypes.func,
      cleanForm: PropTypes.func.isRequired,
      inputChanged: PropTypes.func.isRequired,
      validateInput: PropTypes.func.isRequired,
      validateForm: PropTypes.func.isRequired,
      transactionRejected: PropTypes.func.isRequired,
      transactionAccepted: PropTypes.func.isRequired,
    })
  };

  constructor(transactionType, props) {
    super(props);
    this.transactionType = transactionType;
    const { source, id } = this.props.match.params;
    const fromMessage = this.props.queue && source && id;
    const message = fromMessage ? this.props.queue.find(t =>
      !!config.testnet === !!t.testnet &&
      (t.type === types.MSG_BROADCAST || t.type === types.MSG_SEND_ONE) &&
      t.sourceId === source &&
      t.id === id
    ) : null;

    this.state = {
      fromMessage,
      messageId: id,
      message,
      isSubmitted: false,
      initialized: false,
      readOnly: !!message,
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { message } = state;
    if (!state.initialized) {
      if (message && props.actions.initMessageForm) {
        props.actions.initMessageForm(message.type, message);
      }
    }
    return { initialized: true };
  }

  handleCloseForm = () => {
    this.props.actions.cleanForm(
      this.transactionType
    );
  };

  handleInputChange = (inputValue, inputName) => {
    this.props.actions.inputChanged(
      this.transactionType,
      inputName,
      inputValue
    );
    if (!this.props.inputs[inputName].isValid) {
      this.props.actions.validateInput(
        this.transactionType,
        inputName,
        this.gateway,
      );
    }
  };

  handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.props.actions.validateForm(
      this.transactionType,
      this.gateway,
    );
  };

  handleAccept = (data) => {
    this.props.actions.transactionAccepted(
      this.transactionType,
      data.signature
    );
  };

  handleReject = () => {
    this.props.actions.transactionRejected(
      this.transactionType
    );
  };

  handleSignCancel = () => {
    this.props.actions.transactionRejected(
      this.transactionType
    );
  };

  componentWillUnmount() {
    this.props.actions.cleanForm(
      this.transactionType
    );
  }

  renderSuccessInfo() {
    const { transactionId, transactionFee } = this.props;
    const addressLink = `${config.operatorUrl}blockexplorer/transactions/`;

    return (
      <React.Fragment>
        <Box title="Success" layout="success" icon={faCheck} className={style.transactionSuccess}>
          Transaction id:
          <ButtonLink
            external
            href={`${addressLink}${transactionId}`}
            icon="right"
            layout="secondary"
            size="wide"
            target="_blank"
            rel="noopener noreferrer"
          >
            {transactionId}<FontAwesomeIcon icon={faLink} />
          </ButtonLink>
          <small>Transaction fee:
            <b>{ADS.formatAdsMoney(transactionFee, 11, true)} ADS</b>
          </small>
        </Box>
        <ButtonLink
          to={this.getReferrer()}
          onClick={this.handleCloseForm}
          icon="left"
          layout="primary"
          size="wide"
        >
          <FontAwesomeIcon icon={faTimes} /> Close
        </ButtonLink>
      </React.Fragment>
    );
  }

  renderInputs() {
    return '';
  }

  renderInfo() {
    return '';
  }

  renderFee() {
    const sender = this.props.vault.accounts.find(
      a => a.address === this.props.vault.selectedAccount
    );
    const fee = ADS.calculateFee(
      prepareCommand(this.transactionType, sender, this.props.inputs, 0)
    );
    return (
      <div className={style.feeInfo}>Fee: {ADS.formatClickMoney(fee, 11, true)} ADS</div>
    );
  }

  renderButtons(isDisabled = false) {
    return (
      <Buttons>
        <ButtonLink
          to={this.getReferrer()}
          onClick={this.handleCloseForm}
          layout="secondary"
          disabled={this.props.isSubmitted}
        >Cancel
        </ButtonLink>
        <Button
          type="submit"
          layout="primary"
          disabled={isDisabled || this.props.isSubmitted}
        >Next
        </Button>
      </Buttons>
    );
  }

  renderForm() {
    return (
      <Form onSubmit={this.handleSubmit}>
        {this.renderInputs()}
        {this.renderFee()}
        {this.renderInfo()}
        {this.renderButtons()}
      </Form>
    );
  }

  getTitle() {
    return typeLabels[this.transactionType];
  }

  getDescription() {
    return '';
  }

  render() {
    const {
      vault,
      isSignRequired,
      isSubmitted,
      isTransactionSent,
      accountHash,
      transactionData,
      extra,
      errorMsg,
      history,
    } = this.props;
    const {
      fromMessage,
      message
    } = this.state;

    if (fromMessage && !message) {
      return this.renderErrorPage(404, `Cannot find message ${this.state.messageId}`);
    }

    if (isSignRequired) {
      const transaction = {
        hash: accountHash,
        data: transactionData
      };
      return (
        <SignForm
          transaction={transaction}
          extra={extra}
          vault={vault}
          acceptAction={this.handleAccept}
          rejectAction={this.handleReject}
          cancelAction={this.handleSignCancel}
          cancelLink={this.getReferrer()}
          showLoader={isSubmitted}
          showTitle
          showDoc
          history={history}
        />
      );
    }
    return (
      <Page
        className={style.page}
        cancelLink={this.getReferrer()}
        onCancelClick={this.handleCloseForm}
        showLoader={isSubmitted}
        history={history}
      >
        <h2>
          {this.getTitle()}
        </h2>
        {this.getDescription() ?
          <p className={style.description}><small>{this.getDescription()}</small></p> : ''}
        {errorMsg ? <Box title="Error" layout="warning" icon={faExclamation}>
          {errorMsg}
        </Box> : ''}
        {isTransactionSent ? this.renderSuccessInfo() : this.renderForm()}
      </Page>
    );
  }
}
