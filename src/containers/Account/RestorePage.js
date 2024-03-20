import React from 'react';
import bip39 from 'bip39';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faTimes, faExclamation } from '@fortawesome/free-solid-svg-icons';
import FormComponent from '../../components/FormComponent';
import Form from '../../components/atoms/Form';
import Button from '../../components/atoms/Button';
import ButtonLink from '../../components/atoms/ButtonLink';
import Box from '../../components/atoms/Box';
import LoaderOverlay from '../../components/atoms/LoaderOverlay';
import config from '../../config/config';
import style from './RestorePage.module.css';

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
        <Box layout="warning" icon={faExclamation} title="Restoring your vault will overwrite all current data">
          Your password should be obscure and must be at
          least {config.passwordMinLength} characters long.
        </Box>
        <Form onSubmit={this.handleRestoreSubmit}>
          <div>
            <textarea
              autoFocus
              required
              placeholder="Seed phrase"
              name="seedPhrase"
              value={this.state.seedPhrase}
              onChange={this.handleSeedPhraseChange}
            />
          </div>
          <div>
            <input
              type="password"
              required
              placeholder="New password"
              minLength={config.passwordMinLength}
              name="password"
              value={this.state.password}
              onChange={this.handlePasswordChange}
            />
          </div>
          <div>
            <input
              type="password"
              required
              placeholder="Confirm password"
              minLength={config.passwordMinLength}
              name="password2"
              value={this.state.password2}
              onChange={this.handlePasswordChange}
            />
          </div>
          <div className={style.buttons}>
            <ButtonLink
              className={style.cancel} to={'/'} inverse icon="left" layout="info"
              disabled={this.state.isSubmitted}
            >
              <FontAwesomeIcon icon={faTimes} /> Cancel
            </ButtonLink>
            <Button
              type="submit" icon="right" layout="info"
              disabled={this.state.isSubmitted}
            >
              Restore <FontAwesomeIcon icon={faChevronRight} />
            </Button>
          </div>
        </Form>
      </div>
    );
  }
}

RestorePage.propTypes = {
  restoreAction: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};
