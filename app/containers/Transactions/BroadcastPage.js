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
import CheckboxControl from '../../components/atoms/CheckboxControl';
import ADS from '../../utils/ads';
import { fieldLabels } from './labels';
import style from './style.css';

class BroadcastPage extends TransactionPage {
  static propTypes = {
    ...TransactionPage.propTypes,
    inputs: PropTypes.shape({
      message: PropTypes.object.isRequired,
      rawMessage: PropTypes.object.isRequired,
    })
  }

  constructor(props) {
    super(ADS.TX_TYPES.BROADCAST, props);
  }

  renderInputs() {
    const {
      inputs: { message, rawMessage }
    } = this.props;
    return (
      <div className={style.message}>
        <InputControl
          name="message"
          label={fieldLabels.message}
          value={message.value}
          isValid={message.isValid}
          rows={5}
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
    );
  }
}

export default withRouter(connect(
  state => ({
    vault: state.vault,
    ...state.transactions[ADS.TX_TYPES.BROADCAST]
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
)(BroadcastPage));
