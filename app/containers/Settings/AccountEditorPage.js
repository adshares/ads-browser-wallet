import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faTimes, faCheck, faInfo } from '@fortawesome/free-solid-svg-icons/index';
import { InvalidPasswordError, ItemNotFound, UnknownPublicKeyError } from '../../actions/errors';
import FormComponent from '../../components/FormComponent';
import Form from '../../components/atoms/Form';
import Button from '../../components/atoms/Button';
import ButtonLink from '../../components/atoms/ButtonLink';
import LoaderOverlay from '../../components/atoms/LoaderOverlay';
import ADS from '../../utils/ads';
import config from '../../config';
import Page from '../../components/Page/Page';
import Box from '../../components/atoms/Box';
import style from './SettingsPage.css';
import * as ActionTypes from '../../actions/importKeys';

export default class AccountEditorPage extends FormComponent {
  static PAGE_NAME = 'AccountEditorPage';

  constructor(props) {
    super(props);

    let selectedAccount;
    const { address } = this.props.match.params;

    if (address) {
      selectedAccount = this.props.vault.accounts.find(a => a.address === address);
      if (!selectedAccount) {
        throw new ItemNotFound('account', address);
      }
    }

    this.state = {
      account: selectedAccount,
      name: '',
      address: '',
      publicKey: '',
      password: '',
      isSubmitted: false,
    };

    if (selectedAccount) {
      this.state.name = selectedAccount.name;
      this.state.address = selectedAccount.address;
      this.state.publicKey = selectedAccount.publicKey;
    }
  }

  validateAddress() {
    const addressInput = document.querySelector('[name=address]');

    if (!this.state.address || !ADS.validateAddress(this.state.address)) {
      addressInput.setCustomValidity('Please provide an valid account address');
      return false;
    }

    const address = this.state.account ? this.state.account.address : null;
    if (this.props.vault.accounts.find(
      a => a.address === this.state.address.toUpperCase() && a.address !== address
    )) {
      addressInput.setCustomValidity(`Account ${this.state.address} already exists`);
      return false;
    }

    addressInput.setCustomValidity('');
    return true;
  }

  validateName() {
    const nameInput = document.querySelector('[name=name]');

    if (!this.state.name || this.state.name.length > config.accountNameMaxLength) {
      nameInput.setCustomValidity('Please provide a valid account name');
      return false;
    }

    const address = this.state.account ? this.state.account.address : null;
    if (this.props.vault.accounts.find(
      a => a.name === this.state.name && a.address !== address
    )) {
      nameInput.setCustomValidity(`Name ${this.state.name} already exists`);
      return false;
    }

    nameInput.setCustomValidity('');
    return true;
  }

  validatePublicKey() {
    const publicKeyInput = document.querySelector('[name=publicKey]');

    if (!this.state.publicKey || !ADS.validateKey(this.state.publicKey)) {
      publicKeyInput.setCustomValidity('Please provide an valid public key');
      return false;
    }

    publicKeyInput.setCustomValidity('');
    return true;
  }

  handleAddressChange = (event) => {
    this.handleInputChange(event, this.validateAddress);
  };

  handleNameChange = (event) => {
    this.handleInputChange(event, this.validateName);
  };

  handlePublicKeyChange = (event) => {
    this.handleInputChange(event, this.validatePublicKey);
  };

  handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if ((this.state.account || this.validateAddress()) &&
      this.validateName() &&
      this.validatePublicKey()
    ) {
      this.setState({
        isSubmitted: true
      }, () => {
        try {
          this.props.saveAction(
            this.state.address,
            this.state.name,
            this.state.publicKey,
            this.state.password,
          );
          this.props.history.push(this.getReferrer('/'));
        } catch (err) {
          let input;
          if (err instanceof InvalidPasswordError) {
            input = document.querySelector('[name=password]');
          } else if (err instanceof UnknownPublicKeyError) {
            input = document.querySelector('[name=publicKey]');
          } else {
            input = document.querySelector('[name=address]');
          }

          this.setState({
            isSubmitted: false
          }, () => {
            input.setCustomValidity(err.message);
            input.reportValidity();
          });
        }
      });
    }
  };

  renderLimitWarning() {
    return (
      <div>
        <Box layout="warning" icon={faInfo}>
          Maximum account limit has been reached. Please remove unused accounts.
        </Box>
        <ButtonLink to={this.getReferrer()} icon="left" size="wide" layout="info">
          <FontAwesomeIcon icon={faCheck} /> OK
        </ButtonLink>
      </div>
    );
  }

  renderForm() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <div>
          Name:
          <input
            required
            maxLength={config.accountNameMaxLength}
            placeholder="Account name"
            name="name"
            value={this.state.name}
            onChange={this.handleNameChange}
          />
        </div>
        <div>
          Address:
          <input
            required
            placeholder="Account address"
            readOnly={this.state.account}
            name="address"
            value={this.state.address}
            onChange={this.handleAddressChange}
          />
        </div>
        <div>
          Public key:
          <textarea
            required
            pattern="[0-9a-fA-F]{64}"
            placeholder="Account public key"
            name="publicKey"
            value={this.state.publicKey}
            onChange={this.handlePublicKeyChange}
          />
        </div>
        <div>
          Password:
          <input
            type="password"
            autoFocus
            required
            placeholder="Password"
            name="password"
            value={this.state.password}
            onChange={this.handlePasswordChange}
          />
        </div>
        <div className={style.buttons}>
          <ButtonLink
            to={this.getReferrer()}
            inverse
            icon="left"
            disabled={this.state.isSubmitted}
            layout="info"
          >
            <FontAwesomeIcon icon={faTimes} /> Cancel
          </ButtonLink>
          <Button
            name="button"
            type="submit"
            icon="right"
            layout="info"
            disabled={this.state.isSubmitted}
          >
            {this.state.account ? 'Save' : 'Import'}
            <FontAwesomeIcon icon={faChevronRight} />
          </Button>
        </div>
      </Form>
    );
  }

  render() {
    const {
      page: {
        auth: { authModalOpen, password },
        inputs: { name, publicKey, secretKey }
      }
    } = this.props;
    const limitWarning =
      !this.state.account &&
      this.props.vault.accounts.length >= config.accountsLimit;
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
        onDialogSubmit={() =>
              this.props.actions.passwordValidateThunk(
                AccountEditorPage.PAGE_NAME,
                ActionTypes.IMPORT_KEY
              )
            }
        password={password}
        autenticationModalOpen={authModalOpen}
        cancelLink={this.getReferrer()}
      >
        {this.state.isSubmitted && <LoaderOverlay />}
        {limitWarning ? this.renderLimitWarning() : this.renderForm()}
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
