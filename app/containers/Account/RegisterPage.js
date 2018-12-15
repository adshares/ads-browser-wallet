import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faExclamation, faInfo } from '@fortawesome/free-solid-svg-icons';
import KeyBox from '../../utils/keybox';
import FormComponent from '../../components/FormComponent';
import Form from '../../components/atoms/Form';
import Button from '../../components/atoms/Button';
import ButtonLink from '../../components/atoms/ButtonLink';
import Box from '../../components/atoms/Box';
import Logo from '../../components/Logo/Logo';
import config from '../../config';
import style from './RegisterPage.css';

export default class RegisterPage extends FormComponent {

  constructor(props) {
    super(props);
    this.state = {
      password: '',
      password2: '',
      seedPhrase: KeyBox.generateSeedPhrase(),
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
      this.props.history.push('/register/regulations');
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
    event.target.disabled = true;
    this.props.registerAction(this.state.password, this.state.seedPhrase);
    event.target.disabled = false;
    this.props.history.push('/');
  }

  renderWelcomePage() {
    return (
      <div className={style.welcomePage}>
        <header className={style.logo}>
          <Logo withoutName />
          <h1>Live by ADS</h1>
        </header>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras non turpis ligula.
          Suspendisse ultricies suscipit volutpat. Nulla a dui suscipit, vehicula metus sed,
          molestie nibh.
        </p>
        <ButtonLink to="/register/password" icon="right" layout="info">
          Start <FontAwesomeIcon icon={faChevronRight} />
        </ButtonLink>
        <div className={style.restore}>
          <Link to={'/restore'}>Restore the account from a seed</Link>
        </div>
      </div>
    );
  }

  renderNewPasswordPage() {
    return (
      <div className={style.newPasswordPage}>
        <header>
          <h1>Setup password</h1>
        </header>
        <Box icon={faInfo} layout="info">
          Your password should be obscure and must be at least 8 characters long.
        </Box>
        <Form onSubmit={this.handlePasswordSubmit}>
          <div>
            <input
              type="password"
              autoFocus
              required
              placeholder="Password"
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
            <ButtonLink to={'/register'} inverse icon="left" layout="info">
              <FontAwesomeIcon icon={faChevronLeft} /> Back
            </ButtonLink>
            <Button type="subbmit" icon="right" layout="info">
              Next <FontAwesomeIcon icon={faChevronRight} />
            </Button>
          </div>
        </Form>
      </div>
    );
  }

  renderRegulationsPage() {
    return (
      <div className={style.regulationsPage}>
        <header>
          <h1>Terms and conditions</h1>
        </header>
        <div className={style.regulations}>{config.regulations}</div>
        <div className={style.buttons}>
          <ButtonLink to={'/register/password'} inverse icon="left" layout="info">
            <FontAwesomeIcon icon={faChevronLeft} /> Back
          </ButtonLink>
          <ButtonLink to={'/register/seed'} icon="right" layout="info">
            Accept <FontAwesomeIcon icon={faChevronRight} />
          </ButtonLink>
        </div>
      </div>
    );
  }

  renderSeedPhrasePage() {
    return (
      <div className={style.seedPhrasePage}>
        <header>
          <h1>Mnemonic seed phrase</h1>
        </header>
        <Box title="Warning" layout="warning" icon={faExclamation}>
          A seed phrase includes all the information needed to recover a wallet.
          Please write it down on paper and store safely.
        </Box>
        <Form onSubmit={this.handleSeedPhraseSubmit}>
          <div className={style.refresh}>
            <Button
              onClick={this.handleSeedPhraseRefresh}
              size="small"
              inverse
            >
              Regenerate phrase
            </Button>
          </div>
          <div className={style.dangerContent}>
            <textarea
              value={this.state.seedPhrase}
              readOnly
            />
          </div>
          <div className={style.buttons}>
            <ButtonLink to={'/register/regulations'} inverse icon="left" layout="info">
              <FontAwesomeIcon icon={faChevronLeft} /> Back
            </ButtonLink>
            <Button type="submit" icon="right" layout="info">
              Save <FontAwesomeIcon icon={faChevronRight} />
            </Button>
          </div>
        </Form>
      </div>
    );
  }

  render() {
    const { step } = this.props.match.params;

    switch (step) {
      case 'password':
        return this.renderNewPasswordPage();
      case 'regulations':
        return this.renderRegulationsPage();
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
