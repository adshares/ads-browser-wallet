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
import ADS from '../../utils/ads';
import TransactionPage from './TransactionPage';
import style from './style.css';
import InputControl from '../../components/atoms/InputControl';
import { fieldLabels } from './labels';
import CheckboxControl from '../../components/atoms/CheckboxControl';

class BroadcastPage extends TransactionPage {
  static propTypes = {
    ...TransactionPage.propTypes,
    inputs: PropTypes.shape({
      message: PropTypes.object.isRequired,
      rawMessage: PropTypes.object.isRequired,
    })
  };

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
    queue: state.queue,
    ...state.transactions[ADS.TX_TYPES.BROADCAST]
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
)(BroadcastPage));
