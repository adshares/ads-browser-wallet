import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ItemNotFound } from '../../actions/errors';
import FormComponent from '../../components/FormComponent';
import Form from '../../components/atoms/Form';
import Button from '../../components/atoms/Button';
import Buttons from '../../components/atoms/Buttons';
import ButtonLink from '../../components/atoms/ButtonLink';
import Page from '../../components/Page/Page';
import Box from '../../components/atoms/Box';
import InputControl from '../../components/atoms/InputControl';
import { inputChange, cleanForm } from '../../actions/formActions';
import { SAVE_ACCOUNT, saveAccount } from '../../actions/settingsActions';
import config from '../../config/config';
import style from './SettingsPage.css';

class AccountEditorPage extends FormComponent {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    vault: PropTypes.object.isRequired,
    page: PropTypes.object.isRequired,
    actions: PropTypes.shape({
      inputChange: PropTypes.func.isRequired,
      cleanForm: PropTypes.func.isRequired,
      saveAccount: PropTypes.func.isRequired,
    })
  };

  constructor(props) {
    super(props);

    let selectedAccount = null;
    const { address } = this.props.match.params;

    if (address) {
      selectedAccount = this.props.vault.accounts.find(a => a.address === address);
      if (!selectedAccount) {
        throw new ItemNotFound('account', address);
      }
    }

    this.state = {
      account: selectedAccount,
    };
  }

  componentDidMount() {
    if (this.state.account) {
      this.handleInputChange(this.state.account.name, 'name');
      this.handleInputChange(this.state.account.address, 'address');
    }
  }

  handleInputChange = (inputValue, inputName) => {
    this.props.actions.inputChange(
      SAVE_ACCOUNT,
      inputName,
      inputValue
    );
  };

  handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.props.actions.saveAccount(
      SAVE_ACCOUNT,
      this.state.account ? this.state.account.address : null
    );
  };

  componentWillUnmount() {
    this.props.actions.cleanForm(SAVE_ACCOUNT);
  }

  renderLimitWarning() {
    return (
      <React.Fragment>
        <Box layout="warning" icon={'i'}>
          Maximum account limit has been reached. Please remove unused accounts.
        </Box>
        <ButtonLink to={this.getReferrer()} layout="primary">OK</ButtonLink>
      </React.Fragment>
    );
  }

  renderForm() {
    const {
      page: {
        isSubmitted,
        publicKey,
        publicKeyLoading,
        publicKeyErrorMsg,
        errorMsg,
        inputs: { name, address },
      }
    } = this.props;

    return (
      <React.Fragment>
        {errorMsg && <Box title="Error" layout="danger" icon={'!'}>
          {errorMsg}
        </Box>}
        <Form onSubmit={this.handleSubmit}>
          <InputControl
            isInput
            readOnly={!!this.state.account}
            label="Account address"
            name="address"
            value={address.value}
            errorMessage={address.errorMsg}
            handleChange={this.handleInputChange}
          />
          <InputControl
            isInput
            label="Account name (optional)"
            name="name"
            value={name.value}
            errorMessage={name.errorMsg}
            handleChange={this.handleInputChange}
          />
          {publicKey || publicKeyLoading || publicKeyErrorMsg ?
            <InputControl
              readOnly
              label="Account public key"
              name="publicKey"
              value={publicKey}
            >
              {publicKeyLoading ?
                <div className={style.inputLoader}>
                  <FontAwesomeIcon
                    className={style.inputSpinner}
                    icon={faSpinner}
                    title="loading"
                  />
                </div>
                : '' }
            </InputControl>
            : '' }
          {publicKeyErrorMsg ?
            <Box title={publicKey ? 'Cannot find private key' : 'Cannot find public key'} layout="warning" icon={'!'}>
              {publicKeyErrorMsg}
            </Box> : ''
          }
          <Buttons>
            <ButtonLink
              to={this.getReferrer()}
              disabled={isSubmitted}
              layout="secondary"
              onClick={this.handleCancel}
            >Cancel
            </ButtonLink>
            <Button
              name="button"
              layout="primary"
              disabled={publicKeyLoading || publicKeyErrorMsg || isSubmitted}
            >{this.state.account ? 'Save' : 'Import'}
            </Button>
          </Buttons>
        </Form>
      </React.Fragment>
    );
  }

  render() {
    const limitWarning =
        !this.state.account && this.props.vault.accounts.length >= config.accountsLimit;
    const title = this.state.account ? this.state.account.name : 'Import account';

    return (
      <Page
        title={title}
        smallTitle
        className={style.page}
        cancelLink={this.getReferrer()}
        showLoader={this.props.page.isSubmitted}
        history={history}
      >
        {limitWarning ?
          this.renderLimitWarning() :
          this.renderForm()
        }
      </Page>
    );
  }
}

export default withRouter(connect(
  state => ({
    vault: state.vault,
    page: state.pages[SAVE_ACCOUNT]
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        inputChange,
        cleanForm,
        saveAccount,
      },
      dispatch
    )
  })
)(AccountEditorPage));
