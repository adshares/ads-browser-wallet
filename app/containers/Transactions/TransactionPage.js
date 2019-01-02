import React from 'react';
import PropTypes from 'prop-types';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';
import PageComponent from '../../components/PageComponent';
import Page from '../../components/Page/Page';
import Box from '../../components/atoms/Box';
import SignForm from './SignForm';
import { typeLabels } from './labels';
import style from './TransactionPage.css';

export default class TransactionPage extends PageComponent {
  constructor(transactionType, props) {
    super(props);
    this.transactionType = transactionType;
  }

  handleCloseForm = () => {
    this.props.actions.cleanForm(
      this.transactionType
    );
  }

  handleInputChange = (inputValue, inputName) => {
    this.props.actions.inputChanged(
      this.transactionType,
      inputName,
      inputValue
    );
  }

  handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.props.actions.validateForm(
      this.transactionType
    );
  }

  handleAccept = (signature) => {
    this.props.actions.transactionAccepted(
      this.transactionType,
      signature
    );
  }

  handleReject = () => {
    this.props.actions.transactionRejected(
      this.transactionType
    );
  }

  handleSignCancel = () => {
    this.props.actions.transactionRejected(
      this.transactionType
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
        {errorMsg ? <Box title="Transaction error" layout="warning" icon={faExclamation}>
          {errorMsg}
        </Box> : ''}
        {isTransactionSent ? this.renderSuccessInfo() : this.renderForm()}
      </Page>
    );
  }
}

TransactionPage.propTypes = {
  vault: PropTypes.object.isRequired,
  isSignRequired: PropTypes.bool,
  actions: PropTypes.shape({
    cleanForm: PropTypes.func.isRequired,
    inputChanged: PropTypes.func.isRequired,
    validateForm: PropTypes.func.isRequired,
    transactionRejected: PropTypes.func.isRequired,
    transactionAccepted: PropTypes.func.isRequired,
  })
};
