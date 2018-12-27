import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faTimes } from '@fortawesome/free-solid-svg-icons/index';
import { handleInputChange } from '../../actions/form';
import validateFormThunk from '../../thunks/validateThunk';
import TransactionPage from './TransactionPage';
import Form from '../../components/atoms/Form';
import FormControl from '../../components/atoms/FormControl';
import ButtonLink from '../../components/atoms/ButtonLink';
import Button from '../../components/atoms/Button';
import ADS from '../../utils/ads';
import { fieldLabels } from './labels';
import style from './TransactionPage.css';

@connect(
  state => ({
    page: state.pages.SendOnePage
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        handleInputChange,
        validateFormThunk,
      },
      dispatch
    )
  })
)
export default class SendOnePage extends TransactionPage {
  static PAGE_NAME = 'SendOnePage';
  constructor(props) {
    super(ADS.TX_TYPES.SEND_ONE, props);
  }

  renderForm() {
    const {
      page: {
        inputs: { address, amount, message }
      }
    } = this.props;
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormControl
          name="address"
          label={fieldLabels.recipient}
          value={address.value}
          isValid={address.isValid}
          required
          isInput
          handleChange={value => this.handleInputChange('address', value)}
          errorMessage={address.errorMsg}
        />
        <div className={style.amount}>
          <FormControl
            name="amount"
            label={fieldLabels.amount}
            value={amount.value}
            isValid={amount.isValid}
            required
            isInput
            handleChange={value => this.handleInputChange('amount', value)}
            errorMessage={amount.errorMsg}
          >
            <span>ADS</span>
          </FormControl>
        </div>
        <FormControl
          name="message"
          label={fieldLabels.message}
          value={message.value}
          isValid={message.isValid}
          rows={2}
          handleChange={value => this.handleInputChange('message', value)}
          errorMessage={message.errorMsg}
        />
        <div className={style.buttons}>
          <ButtonLink
            to={this.getReferrer()}
            inverse
            icon="left"
            layout="info"
            disabled={this.state.isSubmitted}
          >
            <FontAwesomeIcon icon={faTimes} /> Cancel
          </ButtonLink>
          <Button
            type="submit"
            icon="right"
            layout="info"
            disabled={this.state.isSubmitted}
          >Next <FontAwesomeIcon icon={faChevronRight} />
          </Button>
        </div>
      </Form>
    );
  }
}
