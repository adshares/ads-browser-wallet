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
} from '../../actions/transactionActions';
import TransactionPage from './TransactionPage';
import InputControl from '../../components/atoms/InputControl';
import ADS from '../../utils/ads';
import { fieldLabels } from './labels';
import style from './style.css';
import Page from '../../components/Page/Page';

class GatePage extends TransactionPage {
  static propTypes = {
    match: PropTypes.object.isRequired,
    ...TransactionPage.propTypes,
    inputs: PropTypes.shape({
      amount: PropTypes.object.isRequired,
      address: PropTypes.object.isRequired,
    })
  }

  constructor(props) {
    super(ADS.TX_TYPES.GATE, props);
  }

  renderInputs() {
    const {
      inputs: { amount, address, gate },
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
            handleChange={this.handleInputChange}
            errorMessage={amount.errorMsg}
          ><span>ADS</span></InputControl>
          <span>Balance: {ADS.formatAdsMoney(account.balance, 11, true)} ADS</span>
        </div>
        <div className={style.message}>
          <InputControl
            name="address"
            label={`${fieldLabels.address} (${this.gate.format})`}
            value={address.value}
            isValid={address.isValid}
            rows={2}
            handleChange={this.handleInputChange}
            errorMessage={address.errorMsg}
          />
        </div>
      </React.Fragment>
    );
  }

  renderFee() {
    // const sender = this.props.vault.accounts.find(
    //   a => a.address === this.props.vault.selectedAccount
    // );
    const fee = 10;// ADS.calculateFee(prepareCommand(this.transactionType, sender, this.props.inputs));
    return (
      <div className={style.feeInfo}>
        <small>You will be charged:</small><br />
        {ADS.formatClickMoney(fee, 11, true)} ADS
        <hr />
        <small>You will receive approximately:</small><br />
        {ADS.formatClickMoney(fee, 11, true)} ADS
      </div>
    );
  }

  getTitle() {
    return this.gate.name;
  }

  render() {
    const { vault: { gates } } = this.props;
    const { code } = this.props.match.params;
    this.gate = gates.find(g => g.code === code);

    if (this.gate !== undefined) {
      return super.render();
    }

    return (
      <Page
        className={style.page}
        title="ADS gates"
        cancelLink={this.getReferrer()}
        onCancelClick={this.handleCloseForm}
        showLoader={gates.length === 0}
        errorMsg={this.gate === undefined ? `Cannot find gate ${code}` : null}
      />
    );
  }
}

export default withRouter(connect(
  state => ({
    vault: state.vault,
    ...state.transactions[ADS.TX_TYPES.GATE],
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        cleanForm,
        inputChanged,
        validateForm,
        transactionAccepted,
        transactionRejected,
      },
      dispatch
    )
  })
)(GatePage));
