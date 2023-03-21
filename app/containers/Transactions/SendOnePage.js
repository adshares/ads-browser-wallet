import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import {
  cleanForm,
  initMessageForm,
  inputChanged,
  transactionAccepted,
  transactionRejected,
  validateForm,
  validateInput,
} from '../../actions/transactionActions';
import TransactionPage from './TransactionPage';
import InputControl from '../../components/atoms/InputControl';
import CheckboxControl from '../../components/atoms/CheckboxControl';
import ADS from '../../utils/ads';
import { fieldLabels } from './labels';
import style from './style.css';


class SendOnePage extends TransactionPage {
  static propTypes = {
    adsOperatorApi: PropTypes.object.isRequired,
    ...TransactionPage.propTypes,
    inputs: PropTypes.shape({
      address: PropTypes.object.isRequired,
      amount: PropTypes.object.isRequired,
      message: PropTypes.object.isRequired,
      rawMessage: PropTypes.object.isRequired,
    })
  }

  constructor(props) {
    super(ADS.TX_TYPES.SEND_ONE, props);
  }

  renderInputs() {
    const {
      inputs: { address, amount, message, rawMessage },
      vault: { accounts, selectedAccount }
    } = this.props;
    const {
      readOnly
    } = this.state;
    const account = accounts.find(a => a.address === selectedAccount);
    const usdRate = this.props.adsOperatorApi.currencyCourses.usdRate;
    const amountInUsd = ADS.calculateToUsd(amount.value, usdRate);
    return (
      <React.Fragment>
        <InputControl
          name="address"
          label={fieldLabels.recipient}
          value={address.value}
          isValid={address.isValid}
          required
          isInput
          handleChange={this.handleInputChange}
          errorMessage={address.errorMsg}
          readOnly={readOnly}
        />
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
            readOnly={readOnly}
          />
          <span>ADS</span>
          <small>{amountInUsd}</small>
        </div>
        <div className={style.transferBalance}>Balance:
          <span> {ADS.formatAdsMoney(account.balance, 11, true)} ADS</span></div>
        <div className={style.messageCheckbox}>
          <CheckboxControl
            name="rawMessage"
            label="Hexadecimal data"
            checked={rawMessage.value}
            handleChange={this.handleInputChange}
            readOnly={readOnly}
          />
        </div>
        <InputControl
          name="message"
          label={fieldLabels.message}
          value={message.value}
          isValid={message.isValid}
          rows={2}
          handleChange={this.handleInputChange}
          errorMessage={message.errorMsg}
          readOnly={readOnly}
        />
      </React.Fragment>
    );
  }
}

export default withRouter(connect(
  state => ({
    vault: state.vault,
    queue: state.queue,
    ...state.transactions[ADS.TX_TYPES.SEND_ONE],
    adsOperatorApi: state.adsOperatorApi,
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        initMessageForm,
        cleanForm,
        inputChanged,
        validateInput,
        validateForm,
        transactionAccepted,
        transactionRejected,
      },
      dispatch
    )
  })
)(SendOnePage));
