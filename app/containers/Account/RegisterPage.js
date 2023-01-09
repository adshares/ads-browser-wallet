/* eslint-disable no-param-reassign,class-methods-use-this */
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import * as KeyBox from '../../utils/keybox';
import FormComponent from '../../components/FormComponent';
import Form from '../../components/atoms/Form';
import Button from '../../components/atoms/Button';
import Buttons from '../../components/atoms/Buttons';
import ButtonLink from '../../components/atoms/ButtonLink';
import Box from '../../components/atoms/Box';
import LoaderOverlay from '../../components/atoms/LoaderOverlay';
import AnimatedLogo from '../../components/Logo/AnimatedLogo';
import config from '../../config/config';
import style from './RegisterPage.css';

export default class RegisterPage extends FormComponent {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      password2: '',
      seedPhrase: KeyBox.generateSeedPhrase(),
      isSubmitted: false,
    };
  }

  validatePasswords() {
    const password2 = document.querySelector('[name=password2]');
    if (this.state.password !== this.state.password2) {
      password2.setCustomValidity("Passwords don't match");
      return false;
    }

    password2.setCustomValidity('');
    return true;
  }

  handlePasswordChange = (event) => {
    this.handleInputChange(event, this.validatePasswords);
  }

  handlePasswordSubmit = (event) => {
    if (this.validatePasswords()) {
      event.preventDefault();
      event.stopPropagation();
      this.props.history.push('/register/terms');
    }
  }

  handleSeedPhraseRefresh = (event, callback) => {
    event.preventDefault();
    event.stopPropagation();
    this.setState({
      seedPhrase: KeyBox.generateSeedPhrase()
    }, callback);
  }

  handleSeedPhraseSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (this.state.password && this.state.seedPhrase) {
      this.setState({
        isSubmitted: true
      }, () => {
        setTimeout(() => {
          this.props.registerAction(
            this.state.password,
            this.state.seedPhrase,
            () => this.props.history.push('/')
          );
        }, 0);
      });
    } else {
      this.props.history.push('/register');
    }
  }

  renderWelcomePage() {
    return (
      <div className={style.welcomePage}>
        <header className={style.logo}>
          <AnimatedLogo />
          <h1>Live by ADS</h1>
          {config.testnet ? <h3>TESTNET</h3> : ''}
        </header>
        <p className={style.about}>{config.about}</p>
        <ButtonLink className={style.about} to="/register/password" layout="primary">
          Start
        </ButtonLink>
        <div className={style.links}>
          <Link to={'/restore'}>Restore the vault from a seed</Link><br />
          {config.testnet ?
            <Link to={'/mainnet'} className={style.mainnetLink}>Switch to the mainnet</Link> :
            <Link to={'/testnet'}>Switch to the testnet</Link>
          }
        </div>
      </div>
    );
  }

  renderNewPasswordPage() {
    return (
      <div className={style.newPasswordPage}>
        <header>
          {config.testnet ? <h3>TESTNET</h3> : ''}
          <h1>Setup password</h1>
        </header>
        <Box icon={'i'} layout="info">
          Your password should be obscure and must be at
          least {config.passwordMinLength} characters long.
        </Box>
        <Form onSubmit={this.handlePasswordSubmit}>
          <div className={style.inputs}>
            <label htmlFor="password">
              Password
              <input
                type="password"
                autoFocus
                required
                minLength={config.passwordMinLength}
                name="password"
                value={this.state.password}
                onChange={this.handlePasswordChange}
              />
            </label>
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
            <ButtonLink to={'/register'} layout="secondary">
              Back
            </ButtonLink>
            <Button type="submit" layout="primary">
              Next
            </Button>
          </Buttons>
        </Form>
      </div>
    );
  }

  renderTermsPage() {
    return (
      <div className={style.termsPage}>
        <header>
          <h1>Terms of Use</h1>
          {config.testnet ? <h3>TESTNET</h3> : ''}
        </header>
        <div className={style.terms}>{config.terms}</div>
        <Buttons>
          <ButtonLink to={'/register/password'} layout="secondary">
            Back
          </ButtonLink>
          <ButtonLink to={'/register/seed'} layout="primary">
            Accept
          </ButtonLink>
        </Buttons>
      </div>
    );
  }

  renderSeedPhrasePage() {
    return (
      <div className={style.seedPhrasePage}>
        {this.state.isSubmitted && <LoaderOverlay />}
        <div>
          <header>
            <h1>Mnemonic seed phrase</h1>
            {config.testnet ? <h3>TESTNET</h3> : ''}
          </header>
          <Box layout="warning" icon={'!'}>
            A seed phrase includes all the information needed to recover a wallet.
            Please write it down on paper and store safely.
          </Box>
        </div>
        <Form onSubmit={this.handleSeedPhraseSubmit}>
          <div className={style.refresh}>
            <button
              onClick={this.handleSeedPhraseRefresh}
              className={style.underlined}
            >
              Regenerate phrase
            </button>
          </div>
          <div>
            <textarea
              value={this.state.seedPhrase}
              readOnly
            />
          </div>
          <Buttons >
            <ButtonLink
              to={'/register/terms'}
              layout="secondary"
              disabled={this.state.isSubmitted}
            >Back
            </ButtonLink>
            <Button
              type="submit"
              layout="primary"
              disabled={this.state.isSubmitted}
            >Save
            </Button>
          </Buttons>
        </Form>
      </div>
    );
  }

  render() {
    const { step } = this.props.match.params;

    switch (step) {
      case 'password':
        return this.renderNewPasswordPage();
      case 'terms':
        return this.renderTermsPage();
      case 'seed':
        return this.renderSeedPhrasePage();
      default:
        return this.renderWelcomePage();
    }
  }
}

RegisterPage.propTypes = {
  registerAction: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};
