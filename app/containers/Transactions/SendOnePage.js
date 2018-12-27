import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faTimes } from '@fortawesome/free-solid-svg-icons/index';
import { cleanForm, inputChanged, transactionRejected } from '../../actions/transactionActions';
import { validateForm, sendTransaction } from '../../thunks/transactionThunk';
import TransactionPage from './TransactionPage';
import Form from '../../components/atoms/Form';
import InputControl from '../../components/atoms/InputControl';
import ButtonLink from '../../components/atoms/ButtonLink';
import Button from '../../components/atoms/Button';
import ADS from '../../utils/ads';
import { fieldLabels } from './labels';
import style from './TransactionPage.css';

@connect(
  state => ({
    ...state.transactions[ADS.TX_TYPES.SEND_ONE]
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        cleanForm,
        inputChanged,
        validateForm,
        transactionRejected,
        sendTransaction,
      },
      dispatch
    )
  })
)
export default class SendOnePage extends TransactionPage {
  constructor(props) {
    super(ADS.TX_TYPES.SEND_ONE, props);
  }

  renderForm() {
    const {
      inputs: { address, amount, message }
    } = this.props;
    return (
      <Form onSubmit={this.handleSubmit}>
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
            type="number"
            handleChange={this.handleInputChange}
            errorMessage={amount.errorMsg}
          ><span>ADS</span></InputControl>
        </div>
        <InputControl
          name="message"
          label={fieldLabels.message}
          value={message.value}
          isValid={message.isValid}
          rows={2}
          handleChange={this.handleInputChange}
          errorMessage={message.errorMsg}
        />
        <div className={style.buttons}>
          <ButtonLink
            to={this.getReferrer()}
            onClick={this.handleCancelClick}
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
      </Form>
    );
  }
}
