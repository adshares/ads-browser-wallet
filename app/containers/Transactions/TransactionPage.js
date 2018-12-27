import React from 'react';
import PropTypes from 'prop-types';
import PageComponent from '../../components/PageComponent';
import Page from '../../components/Page/Page';
import SignForm from './SignForm';
import { typeLabels } from './labels';
import style from './TransactionPage.css';

export default class TransactionPage extends PageComponent {
  static PAGE_NAME = 'TransactionForm';

  constructor(type, props) {
    super(props);
    this.state = {
      type,
      transaction: null,
      signRequired: false,
      isSubmitted: false,
    };
  }

  handleInputChange(inputName, inputValue) {
    console.debug('TF handleInputChange', inputName, inputValue);
    this.props.actions.handleInputChange(
      this.constructor.PAGE_NAME,
      inputName,
      inputValue
    );
  }

  handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    console.debug('TF handleSubmit');
    this.props.actions.validateFormThunk(
      this.constructor.PAGE_NAME
    );
  }

  handleAccept = (signature) => {
    this.setState({
      isSubmitted: true
    }, () => {
      console.log('accepted', signature);
    });
  }

  handleReject = () => {
    this.setState({
      isSubmitted: true
    }, () => {
      console.log('rejected');
    });
  }

  render() {
    if (this.state.signRequired) {
      return (
        <SignForm
          transaction={this.state.transaction}
          vault={this.props.vault}
          acceptAction={this.handleAccept}
          rejectAction={this.handleReject}
          cancelLink={this.getReferrer()}
          showLoader={this.state.isSubmitted}
        />
      );
    }
    return (
      <Page className={style.page} cancelLink={this.getReferrer()}>
        <h2>{typeLabels[this.state.type]}</h2>
        {this.renderForm()}
      </Page>
    );
  }
}

TransactionPage.propTypes = {
  vault: PropTypes.object.isRequired,
  actions: PropTypes.shape({
    handleInputChange: PropTypes.func.isRequired,
    validateFormThunk: PropTypes.func.isRequired,
  })
};
