import React from 'react';
import bip39 from 'bip39';
import PropTypes from 'prop-types';
import FormComponent from '../../components/FormComponent';
import Form from '../../components/atoms/Form';
import Button from '../../components/atoms/Button';
import Buttons from '../../components/atoms/Buttons';
import ButtonLink from '../../components/atoms/ButtonLink';
import Box from '../../components/atoms/Box';
import LoaderOverlay from '../../components/atoms/LoaderOverlay';
import config from '../../config/config';
import style from './RestorePage.css';

export default class RestorePage extends FormComponent {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      password2: '',
      seedPhrase: '',
      isSubmitted: false,
    };
  }

  validateSeedPhrase() {
    const seedPhrase = document.querySelector('[name=seedPhrase]');
    const mnemonic = this.state.seedPhrase;
    if (
      mnemonic.split(/\s+/g).length < 12 ||
      !bip39.validateMnemonic(mnemonic)
    ) {
      seedPhrase.setCustomValidity('Please provide a valid seed phrase');
      return false;
    }

    seedPhrase.setCustomValidity('');
    return true;
  }

  validatePasswords() {
    const password2 = document.querySelector('[name=password2]');
    if (this.state.password !== this.state.password2) {
      password2.setCustomValidity('Passwords don\'t match');
      return false;
    }

    password2.setCustomValidity('');
    return true;
  }

  handleSeedPhraseChange = (event) => {
    this.handleInputChange(event, this.validateSeedPhrase);
  };

  handlePasswordChange = (event) => {
    this.handleInputChange(event, this.validatePasswords);
  };

  handleRestoreSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (this.validateSeedPhrase() && this.validatePasswords()) {
      this.setState({
        isSubmitted: true
      }, () => {
        setTimeout(() => {
          this.props.restoreAction(
            this.state.password,
            this.state.seedPhrase,
            () => this.props.history.push('/')
          );
        }, 0);
      });
    }
  };

  render() {
    return (
      <div className={style.page}>
        {this.state.isSubmitted && <LoaderOverlay />}
        <header>
          <h1>Restore the vault</h1>
          {config.testnet ? <h3>TESTNET</h3> : ''}
        </header>
        <Box layout="warning" icon={'!'} title="Restoring your vault will overwrite all current data">
          Your password should be obscure and must be at
          least {config.passwordMinLength} characters long.
        </Box>
        <Form onSubmit={this.handleRestoreSubmit}>
          <div>
            <label htmlFor="seedPhrase">
              Seed phrase
              <textarea
                autoFocus
                required
                name="seedPhrase"
                rows="3"
                value={this.state.seedPhrase}
                onChange={this.handleSeedPhraseChange}
              />
            </label>
          </div>
          <div>
            <label htmlFor="password">
              Password
              <input
                type="password"
                required
                minLength={config.passwordMinLength}
                name="password"
                value={this.state.password}
                onChange={this.handlePasswordChange}
              />
            </label>
          </div>
          <div>
            <label htmlFor="password2">
              Confirm password
              <input
                type="password"
                required
                minLength={config.passwordMinLength}
                name="password2"
                value={this.state.password2}
                onChange={this.handlePasswordChange}
              />
            </label>
          </div>
          <Buttons>
            <ButtonLink
              className={style.cancel} to={'/'} layout="secondary"
              disabled={this.state.isSubmitted}
            >
              Back
            </ButtonLink>
            <Button
              type="submit" layout="primary"
              disabled={this.state.isSubmitted}
            >
              Next
            </Button>
          </Buttons>
        </Form>
      </div>
    );
  }
}

RestorePage.propTypes = {
  restoreAction: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};
