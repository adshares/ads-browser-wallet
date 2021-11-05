import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import {
  cleanForm,
  inputChanged,
  validateInput,
  validateForm,
  transactionAccepted,
  transactionRejected,
} from '../../actions/transactionActions';
import TransactionPage from './TransactionPage';
import InputControl from '../../components/atoms/InputControl';
import CheckboxControl from '../../components/atoms/CheckboxControl';
import ADS from '../../utils/ads';
import { fieldLabels } from './labels';
import style from './style.css';


class SendOnePage extends TransactionPage {
  static propTypes = {
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
    const account = accounts.find(a => a.address === selectedAccount);
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
          ><span>ADS</span></InputControl>
          <span>Balance: {ADS.formatAdsMoney(account.balance, 11, true)} ADS</span>
        </div>
        <div className={style.message}>
          <InputControl
            name="message"
            label={fieldLabels.message}
            value={message.value}
            isValid={message.isValid}
            rows={2}
            handleChange={this.handleInputChange}
            errorMessage={message.errorMsg}
          >
            <div className={style.messageCheckbox}>
              <CheckboxControl
                name="rawMessage"
                label="Hexadecimal data"
                checked={rawMessage.value}
                handleChange={this.handleInputChange}
              />
            </div>
          </InputControl>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(connect(
  state => ({
    vault: state.vault,
    queue: state.queue,
    ...state.transactions[ADS.TX_TYPES.SEND_ONE]
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
      },
      dispatch
    )
  })
)(SendOnePage));
