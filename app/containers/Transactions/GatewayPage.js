/* eslint-disable class-methods-use-this */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import {
  cleanForm,
  inputChanged,
  validateForm,
  transactionAccepted,
  transactionRejected,
  getGatewayFee,
} from '../../actions/transactionActions';
import TransactionPage from './TransactionPage';
import InputControl from '../../components/atoms/InputControl';
import ADS from '../../utils/ads';
import { sanitize0xHex } from '../../utils/utils';
import { fieldLabels } from './labels';
import style from './style.css';
import Page from '../../components/Page/Page';
import { prepareCommand } from '../../epics/transactionEpics';
import LoaderOverlay from '../../components/atoms/LoaderOverlay';

class GatewayPage extends TransactionPage {
  static propTypes = {
    match: PropTypes.object.isRequired,
    ...TransactionPage.propTypes,
    inputs: PropTypes.shape({
      amount: PropTypes.object.isRequired,
      address: PropTypes.object.isRequired,
    })
  }

  constructor(props) {
    super(ADS.TX_TYPES.GATEWAY, props);
  }

  handleAmountChange = (inputValue, inputName) => {
    this.handleInputChange(inputValue, inputName);
    this.props.actions.getGatewayFee(
      this.gateway.code,
      ADS.strToClicks(inputValue) || 0,
      sanitize0xHex(this.props.inputs.address.value)
    );
  };

  handleAddressChange = (inputValue, inputName) => {
    this.handleInputChange(inputValue, inputName);
    this.props.actions.getGatewayFee(
      this.gateway.code,
      ADS.strToClicks(this.props.inputs.amount.value) || 0,
      sanitize0xHex(inputValue)
    );
  };

  renderInputs() {
    const {
      inputs: { amount, address },
      vault: { accounts, selectedAccount }
    } = this.props;
    const account = accounts.find(a => a.address === selectedAccount);

    return (
      <React.Fragment>
        <div className={style.amount}>
          <InputControl
            name="amount"
            label={fieldLabels.amount}
            value={amount.value}
            isValid={amount.isValid}
            required
            isInput
            handleChange={this.handleAmountChange}
            errorMessage={amount.errorMsg}
          ><span>ADS</span></InputControl>
          <span>Balance: {ADS.formatAdsMoney(account.balance, 11, true)} ADS</span>
        </div>
        <div>
          <InputControl
            name="address"
            label={`${fieldLabels.address} (${this.gateway.name})`}
            value={address.value}
            isValid={address.isValid}
            rows={2}
            handleChange={this.handleAddressChange}
            errorMessage={address.errorMsg}
          />
        </div>
      </React.Fragment>
    );
  }

  renderFee() {
    const sender = this.props.vault.accounts.find(
      a => a.address === this.props.vault.selectedAccount
    );
    const command = prepareCommand(this.transactionType, sender, this.props.inputs);
    const chargedAmount = ADS.calculateChargedAmount(command);
    const externalFee = this.props.gatewayFee.value;
    const receivedAmount = ADS.calculateReceivedAmount(externalFee, command);
    return (
      <div className={style.feeInfo}>
        {this.props.gatewayFee.isSubmitted ? <LoaderOverlay /> : ''}
        <small>You will be charged:</small><br />
        {ADS.formatClickMoney(chargedAmount, 11, true)} ADS
        <hr />
        <small>You will receive approximately:</small><br />
        {externalFee === null ? '---' : ADS.formatClickMoney(receivedAmount, 11, true)} ADS
      </div>
    );
  }

  getTitle() {
    return `Send to ${this.gateway.name}`;
  }

  getDescription() {
    return this.gateway.description;
  }

  render() {
    const { vault: { gateways } } = this.props;
    const { code } = this.props.match.params;
    this.gateway = gateways.find(g => g.code === code);

    if (this.gateway !== undefined) {
      return super.render();
    }

    return (
      <Page
        className={style.page}
        title="Wrapped ADS gateways"
        cancelLink={this.getReferrer()}
        onCancelClick={this.handleCloseForm}
        showLoader={gateways.length === 0}
        errorMsg={this.gateway === undefined ? `Cannot find gateway ${code}` : null}
      />
    );
  }
}

export default withRouter(connect(
  state => ({
    vault: state.vault,
    ...state.transactions[ADS.TX_TYPES.GATEWAY],
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        cleanForm,
        inputChanged,
        validateForm,
        transactionAccepted,
        transactionRejected,
        getGatewayFee,
      },
      dispatch
    )
  })
)(GatewayPage));
