/* eslint-disable class-methods-use-this */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';
import config from '../../config/config';
import {
  cleanForm,
  inputChanged,
  validateInput,
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
import Box from '../../components/atoms/Box';

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

  calculateFee() {
    const sender = this.props.vault.accounts.find(
      a => a.address === this.props.vault.selectedAccount
    );
    const command = prepareCommand(this.transactionType, sender, this.props.inputs);
    this.chargedAmount = ADS.calculateChargedAmount(command);
    this.externalFee = this.props.gatewayFee.value;
    this.receivedAmount = ADS.calculateReceivedAmount(this.externalFee, command);
    this.feeShare = 1.0 - (this.receivedAmount / this.chargedAmount);
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

  renderButtons() {
    return super.renderButtons(this.feeShare > config.feeThreshold);
  }

  renderFee() {
    return (
      <div className={style.feeInfoBox}>
        { this.feeShare > config.feeThreshold ? <Box title="" layout="danger" icon={faExclamation}>
          The fee exceeded {ADS.formatPercent(config.feeThreshold, 0)}
        </Box> : ''}
        <div className={style.feeInfo}>
          {this.props.gatewayFee.isSubmitted ? <LoaderOverlay /> : ''}
          <small>You will be charged:</small><br />
          {ADS.formatClickMoney(this.chargedAmount, 11, true)} ADS
          <hr />
          <small>You will receive approximately:</small><br />
          {this.externalFee === null ? '---' : ADS.formatClickMoney(this.receivedAmount, 11, true)} ADS
        </div>
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
    this.gateway = gateways !== undefined ? gateways.find(g => g.code === code) : undefined;
    if (this.gateway !== undefined) {
      this.calculateFee();
      return super.render();
    }

    return (
      <Page
        className={style.page}
        title="Wrapped ADS gateways"
        cancelLink={this.getReferrer()}
        onCancelClick={this.handleCloseForm}
        showLoader={!gateways || gateways.length === 0}
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
        validateInput,
        validateForm,
        transactionAccepted,
        transactionRejected,
        getGatewayFee,
      },
      dispatch
    )
  })
)(GatewayPage));
