import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  faChevronRight,
  faTimes,
  faCheck,
  faInfo,
  faSpinner,
  faExclamation
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ItemNotFound } from '../../actions/errors';
import FormComponent from '../../components/FormComponent';
import Form from '../../components/atoms/Form';
import Button from '../../components/atoms/Button';
import ButtonLink from '../../components/atoms/ButtonLink';
import LoaderOverlay from '../../components/atoms/LoaderOverlay';
import Page from '../../components/Page/Page';
import Box from '../../components/atoms/Box';
import InputControl from '../../components/atoms/InputControl';
import { inputChange, cleanForm } from '../../actions/formActions';
import { SAVE_ACCOUNT, saveAccount } from '../../actions/settingsActions'
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

  // componentDidMount() {
  //   if (this.state.account) {
  //     this.handleInputChange('name', this.state.account.name);
  //     this.handleInputChange('address', this.state.account.address);
  //     this.handleInputChange('publicKey', this.state.account.publicKey);
  //   }
  // }

  // handleSubmit = (event) => {
  //   event.preventDefault();
  //   event.stopPropagation();
  //   // eslint-disable-next-line no-unused-expressions
  //   this.state.account ?
  //     this.props.actions.accountEditFormValidate(
  //       SAVE_ACCOUNT,
  //       {
  //         name: this.state.account.name,
  //         address: this.state.account.address,
  //         publicKey: this.state.account.publicKey,
  //       }
  //     )
  //     : this.props.actions.formValidate(SAVE_ACCOUNT);
  // };
  //
  // handleCancel = () => {
  //   this.props.actions.formClean(SAVE_ACCOUNT);
  // };

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
    this.props.actions.saveAccount(SAVE_ACCOUNT);
  };

  componentWillUnmount() {
    this.props.actions.cleanForm(SAVE_ACCOUNT);
  }

  renderLimitWarning() {
    return (
      <React.Fragment>
        <Box layout="warning" icon={faInfo}>
          Maximum account limit has been reached. Please remove unused accounts.
        </Box>
        <ButtonLink to={this.getReferrer()} icon="left" size="wide" layout="info">
          <FontAwesomeIcon icon={faCheck} /> OK
        </ButtonLink>
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
        {errorMsg && <Box title="Error" layout="danger" icon={faExclamation}>
          {errorMsg}
        </Box>}
        <Form onSubmit={this.handleSubmit}>
          <InputControl
            isInput
            label="Account name"
            name="name"
            value={name.value}
            errorMessage={name.errorMsg}
            handleChange={this.handleInputChange}
          />
          <InputControl
            isInput
            readOnly={!!this.state.account}
            label="Account address"
            name="address"
            value={address.value}
            errorMessage={address.errorMsg}
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
            <Box title={publicKey ? 'Cannot find private key' : 'Cannot find public key'} layout="warning" icon={faExclamation}>
              {publicKeyErrorMsg}<br />
              You can still add this account, but you may have problems with transactions.
            </Box> : ''
          }
          <div className={style.buttons}>
            <ButtonLink
              to={this.getReferrer()}
              inverse
              icon="left"
              disabled={isSubmitted}
              layout="info"
              onClick={this.handleCancel}
            >
              <FontAwesomeIcon icon={faTimes} /> Cancel
            </ButtonLink>
            <Button
              name="button"
              icon="right"
              layout="info"
              disabled={publicKeyLoading || isSubmitted}
            >
              {this.state.account ? 'Save' : 'Import'}
              <FontAwesomeIcon icon={faChevronRight} />
            </Button>
          </div>
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

export default connect(
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
)(AccountEditorPage);
