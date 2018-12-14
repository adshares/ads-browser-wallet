import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faTimes, faCheck, faInfo } from '@fortawesome/free-solid-svg-icons/index';
import FormComponent from '../../components/FormComponent';
import Form from '../../components/atoms/Form';
import Button from '../../components/atoms/Button';
import ButtonLink from '../../components/atoms/ButtonLink';
import LoaderOverlay from '../../components/atoms/LoaderOverlay';
import ADS from '../../utils/ads';
import config from '../../config';
import style from '../../genericStyles/Page.css';
import { InvalidPasswordError, UnknownPublicKeyError } from '../../actions/errors';
import Page from '../../components/Page/Page';
import Box from '../../components/atoms/Box';

export default class AccountEditorPage extends FormComponent {

  constructor(props) {
    super(props);

    let selectedAccount = {};
    const { address } = this.props.match.params;

    if (address) {
      selectedAccount = this.props.vault.accounts.find(a => a.address === address);
      if (!selectedAccount) {
        throw new Error('Account doesn\'t exist');
      }
    }

    this.state = {
      accountAddress: address,
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

    if (this.props.vault.accounts.find(
      a => a.address === this.state.address.toUpperCase() && a.address !== this.state.accountAddress
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

    if ((this.state.accountAddress || this.validateAddress()) &&
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
        {this.state.accountAddress ? '' : <div>
          Address:
          <input
            required
            placeholder="Account address"
            readOnly={this.state.accountAddress}
            name="address"
            value={this.state.address}
            onChange={this.handleAddressChange}
          />
        </div>}
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
          >
            <FontAwesomeIcon icon={faTimes} /> Cancel
          </ButtonLink>
          <Button
            name="button"
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
    const { logoutAction, vault } = this.props;
    const limitWarning =
      !this.state.accountAddress &&
      this.props.vault.accounts.length >= config.accountsLimit;
    const title = this.state.accountAddress ?
      `Edit account ${this.state.accountAddress}` :
      'Import new account';

    return (
      <Page
        title={title} logoutAction={logoutAction}
        accounts={vault.accounts}
      >
        {this.state.isSubmitted && <LoaderOverlay />}
        {limitWarning ? this.renderLimitWarning() : this.renderForm()}
      </Page>
    );
  }
}

AccountEditorPage.propTypes = {
  vault: PropTypes.object.isRequired,
  saveAction: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  logoutAction: PropTypes.func.isRequired,
};
