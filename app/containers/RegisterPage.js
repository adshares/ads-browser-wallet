import React from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import Form from '../components/atoms/Form';
import Button from '../components/atoms/Button';
import ButtonLink from '../components/atoms/ButtonLink';
import Box from '../components/atoms/Box';
import config from './../config';
import style from './RegisterPage.css';

export default class RegisterPage extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      password: '',
      password2: '',
      seedPhrase: this.randSeedPhrase(),
    };
    // This binding is necessary to make `this` work in the callback
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handlePasswordSubmit = this.handlePasswordSubmit.bind(this);
    this.handleSeedPhraseRefresh = this.handleSeedPhraseRefresh.bind(this);
    this.handleSeedPhraseSubmit = this.handleSeedPhraseSubmit.bind(this);
  }

  randSeedPhrase() {
    const seedPhrase = 'test' + Math.random();
    return seedPhrase;
  }

  handleInputChange(event, callback) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    }, callback);
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

  handlePasswordChange(event) {
    this.handleInputChange(event, this.validatePasswords);
  }

  handlePasswordSubmit(event) {
    if (this.validatePasswords()) {
      event.preventDefault();
      event.stopPropagation();
      this.props.history.push('/register/regulations');
    }
  }

  handleSeedPhraseRefresh(event, callback) {
    event.preventDefault();
    event.stopPropagation();
    this.setState({
      seedPhrase: this.randSeedPhrase()
    }, callback);
  }

  handleSeedPhraseSubmit(event) {
    event.preventDefault();
    event.stopPropagation();

    console.debug(this.state);

    // this.props.history.push('/');
  }

  renderWelcomePage() {
    return (
      <div className={style.welcomePage}>
        <header className={style.logo}>
          <img alt="Adshares" src="img/logo.svg" />
          <h1>Live by ADS</h1>
        </header>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras non turpis ligula.
          Suspendisse ultricies suscipit volutpat. Nulla a dui suscipit, vehicula metus sed,
          molestie nibh.
        </p>
        <ButtonLink to="/register/password">Start</ButtonLink>
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
        <p>
          Your password should be obscure and must be at least 8 characters long.
        </p>
        <Form onSubmit={this.handlePasswordSubmit}>
          <div>
            <input
              type="password"
              autoFocus
              required
              placeholder="Password"
              minLength="1"
              name="password"
              value={this.state.password}
              onChange={this.handlePasswordChange}
            />
          </div>
          <div>
            <input
              type="password"
              autoFocus
              required
              placeholder="Confirm password"
              minLength="1"
              name="password2"
              value={this.state.password2}
              onChange={this.handlePasswordChange}
            />
          </div>
          <Button type="subbmit">Save</Button>
        </Form>
        <div className={style.backLink}>
          <Link to={'/register'}>Back</Link>
        </div>
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
        <ButtonLink to={'/register/seed'}>Accept</ButtonLink>
        <div className={style.backLink}>
          <Link to={'/register/password'}>Back</Link>
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
        <Box title="Warning" type="danger">
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
          <div>
            <textarea
              value={this.state.seedPhrase}
              readOnly
            />
          </div>
          <Button type="submit">Save</Button>
        </Form>
        <div className={style.backLink}>
          <Link to={'/register/regulations'}>Back</Link>
        </div>
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
  match: PropTypes.object,
  history: PropTypes.object,
};
