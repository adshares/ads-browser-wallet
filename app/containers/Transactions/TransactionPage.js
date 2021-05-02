/* eslint-disable class-methods-use-this */
import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faExclamation,
  faCheck,
  faExternalLinkAlt,
  faTimes,
  faChevronRight,
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
import SignForm from './SignForm';
import { typeLabels } from './labels';
import style from './style.css';

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
    actions: PropTypes.shape({
      cleanForm: PropTypes.func.isRequired,
      inputChanged: PropTypes.func.isRequired,
      validateForm: PropTypes.func.isRequired,
      transactionRejected: PropTypes.func.isRequired,
      transactionAccepted: PropTypes.func.isRequired,
    })
  };

  constructor(transactionType, props) {
    super(props);
    this.transactionType = transactionType;
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
  };

  handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.props.actions.validateForm(
      this.transactionType
    );
  };

  handleAccept = (signature) => {
    this.props.actions.transactionAccepted(
      this.transactionType,
      signature
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
            layout="contrast"
            size="wide"
            target="_blank"
            rel="noopener noreferrer"
          >
            {transactionId}<FontAwesomeIcon icon={faExternalLinkAlt} />
          </ButtonLink>
          <small>Transaction fee:
            <b>{ADS.formatAdsMoney(transactionFee, 11, true)} ADS</b>
          </small>
        </Box>
        <ButtonLink
          to={this.getReferrer()}
          onClick={this.handleCloseForm}
          icon="left"
          layout="info"
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
    const fee = ADS.calculateFee(prepareCommand(this.transactionType, sender, this.props.inputs));
    return (
      <div className={style.feeInfo}>Fee: {ADS.formatClickMoney(fee, 11, true)} ADS</div>
    );
  }

  renderButtons() {
    return (
      <div className={style.buttons}>
        <ButtonLink
          to={this.getReferrer()}
          onClick={this.handleCloseForm}
          inverse
          icon="left"
          layout="info"
          disabled={this.props.isSubmitted}
        >
          <FontAwesomeIcon icon={faTimes} /> Cancel
        </ButtonLink>
        <Button
          type="submit"
          icon="right"
          layout="info"
          disabled={this.props.isSubmitted}
        >Next <FontAwesomeIcon icon={faChevronRight} />
        </Button>
      </div>
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

  render() {
    const {
      vault,
      isSignRequired,
      isSubmitted,
      isTransactionSent,
      accountHash,
      transactionData,
      errorMsg,
      history
    } = this.props;

    if (isSignRequired) {
      const transaction = {
        hash: accountHash,
        data: transactionData
      };
      return (
        <SignForm
          transaction={transaction}
          vault={vault}
          acceptAction={this.handleAccept}
          rejectAction={this.handleReject}
          cancelAction={this.handleSignCancel}
          cancelLink={this.getReferrer()}
          showLoader={isSubmitted}
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
        <h2>{typeLabels[this.transactionType]}</h2>
        {errorMsg ? <Box title="Error" layout="warning" icon={faExclamation}>
          {errorMsg}
        </Box> : ''}
        {isTransactionSent ? this.renderSuccessInfo() : this.renderForm()}
      </Page>
    );
  }
}
