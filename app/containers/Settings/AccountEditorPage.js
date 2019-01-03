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
import config from '../../config/config';
import Page from '../../components/Page/Page';
import Box from '../../components/atoms/Box';
import style from './SettingsPage.css';
import InputControl from '../../components/atoms/InputControl';
import { inputChange, passwordChange, toggleVisibility, passInputValidate, formValidate, formClean, accountEditFormValidate } from '../../actions/form';
import { importAccountPublicKey } from '../../actions/settingsActions';

@connect(
  state => ({
    vault: state.vault,
    page: state.pages.AccountEditorPage
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        handleInputChange: inputChange,
        handlePasswordChange: passwordChange,
        formValidate,
        accountEditFormValidate,
        passInputValidate,
        toggleVisibility,
        formClean,
        importAccountPublicKey
      },
      dispatch
    )
  })
)

export default class AccountEditorPage extends FormComponent {
  static PAGE_NAME = 'AccountEditorPage';

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
      this.handleInputChange('name', this.state.account.name);
      this.handleInputChange('address', this.state.account.address);
      this.handleInputChange('publicKey', this.state.account.publicKey);
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.state.account ?
      this.props.actions.accountEditFormValidate(
          AccountEditorPage.PAGE_NAME,
        {
          name: this.state.account.name,
          address: this.state.account.address,
          publicKey: this.state.account.publicKey,
        }
      )
      : this.props.actions.formValidate(AccountEditorPage.PAGE_NAME);
  };

  handleCancel = () => {
    this.props.actions.formClean(AccountEditorPage.PAGE_NAME);
  };

  handleInputChange = (inputName, inputValue) => {
    this.props.actions.handleInputChange(
      AccountEditorPage.PAGE_NAME,
      inputName,
      inputValue
    );
  };

  render() {
    const {
      page: {
        publicKey, publicKeyLoading, publicKeyErrorMsg,
        isSubmitted,
        auth: { authModalOpen, password },
        inputs: { name, address },
      }
    } = this.props;
    const limitWarning =
        !this.state.account && this.props.vault.accounts.length >= config.accountsLimit;
    const title = this.state.account ? this.state.account.name : 'Import an account';

    return (
      <Page
        title={title}
        smallTitle
        className={style.page}
        onPasswordInputChange={value =>
              this.props.actions.handlePasswordChange(
                AccountEditorPage.PAGE_NAME,
                value
              )
            }
        onDialogSubmit={() => {
          this.props.actions.passInputValidate(
                AccountEditorPage.PAGE_NAME
              );
          this.props.saveAction();
        }}
        password={password}
        authenticationModalOpen={authModalOpen}
        cancelLink={this.getReferrer()}
        onCancelClick={this.handleCancel}
      >
        {isSubmitted && <LoaderOverlay />}
        {limitWarning ? (
          <div>
            <Box layout="warning" icon={faInfo}>
              Maximum account limit has been reached. Please remove unused accounts.
            </Box>
            <ButtonLink to={this.getReferrer()} icon="left" size="wide" layout="info">
              <FontAwesomeIcon icon={faCheck} /> OK
            </ButtonLink>
          </div>
            ) : (
              <Form onSubmit={this.handleSubmit}>
                <InputControl
                  required
                  isInput
                  maxLength={config.accountNameAndKeyMaxLength}
                  label="Account name"
                  value={name.value}
                  errorMessage={name.errorMsg}
                  handleChange={value => this.handleInputChange('name', value)}
                />
                <InputControl
                  required
                  isInput
                  readOnly={!!this.state.account}
                  label="Account address"
                  value={address.value}
                  errorMessage={address.errorMsg}
                  handleChange={value => this.handleInputChange('address', value)}
                />
                {publicKey || publicKeyLoading || publicKeyErrorMsg ?
                  <InputControl
                    required
                    readOnly
                    label="Account public key"
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
            )}
      </Page>
    );
  }
}

AccountEditorPage.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  vault: PropTypes.object.isRequired,
  saveAction: PropTypes.func.isRequired,
};
