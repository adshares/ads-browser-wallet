import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faTimes, faInfo, faCheck } from '@fortawesome/free-solid-svg-icons/index';
import { InvalidPasswordError, AccountsLimitError, UnknownPublicKeyError } from '../actions/errors';
import FormPage from '../components/FormPage';
import Form from '../components/atoms/Form';
import Button from '../components/atoms/Button';
import ButtonLink from '../components/atoms/ButtonLink';
import Box from '../components/atoms/Box';
import LoaderOverlay from '../components/atoms/LoaderOverlay';
import ADS from '../utils/ads';
import config from './../config';
import style from './EditAccountPage.css';

export default class EditAccountPage extends FormPage {

  constructor(props) {
    super(props);

    let selectedAccount = {};
    const { accountAddress } = this.props.match.params;

    if (accountAddress) {
      selectedAccount = this.props.vault.accounts.find(a => a.address === accountAddress);
      if (!selectedAccount) {
        throw new Error('Account doesn\'t exist');
      }
    }

    this.state = {
      accountAddress,
      name: selectedAccount.name || '',
      address: selectedAccount.address || '',
      publicKey: selectedAccount.publicKey || '',
      password: '',
      isSubmitted: false,
    };
  }

  validateAddress() {
    const addressInput = document.querySelector('[name=address]');

    if (!this.state.address || !ADS.validateAddress(this.state.address)) {
      addressInput.setCustomValidity('Please provide an valid account address');
      return false;
    }

    if (this.props.vault.accounts.find(a => a.address === this.state.address)) {
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

    if (this.props.vault.accounts.find(
      a => a.name === this.state.name && a.address !== this.state.accountAddress
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

    if (this.validateName() && this.validateAddress() && this.validatePublicKey()) {
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
        <ButtonLink
          className={style.cancel} to={this.getReferrer()} icon="left" size="wide"
        >
          <FontAwesomeIcon icon={faCheck} /> OK
        </ButtonLink>
      </div>
    );
  }

  renderForm() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <div>
          <input
            required
            placeholder="Account address"
            name="address"
            value={this.state.address}
            onChange={this.handleAddressChange}
          />
        </div>
        <div>
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
            className={style.cancel} to={this.getReferrer()} inverse icon="left"
            disabled={this.state.isSubmitted}
          >
            <FontAwesomeIcon icon={faTimes} /> Cancel
          </ButtonLink>
          <Button name="button"
            type="submit" icon="right"
            disabled={this.state.isSubmitted}
          >
            {this.state.accountAddress ? 'Save' : 'Import'}
            <FontAwesomeIcon icon={faChevronRight} />
          </Button>
        </div>
      </Form>
    );
  }

  render() {
    const limitWarning =
      !this.state.accountAddress &&
      this.props.vault.accounts.length >= config.accountsLimit;

    return (
      <div className={style.page}>
        {this.state.isSubmitted && <LoaderOverlay />}
        <header>
          <h1>
            {this.state.accountAddress ? `Edit account ${this.state.address}` : 'Import new account'}
          </h1>
        </header>
        {limitWarning ? this.renderLimitWarning() : this.renderForm()}
      </div>
    );
  }
}

EditAccountPage.propTypes = {
  vault: PropTypes.object.isRequired,
  saveAction: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};
