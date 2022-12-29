import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import FormComponent from '../../components/FormComponent';
import Form from '../../components/atoms/Form';
import Button from '../../components/atoms/Button';
import AnimatedLogo from '../../components/Logo/AnimatedLogo';
import config from '../../config/config';
import style from './LoginPage.css';

export default class LoginPage extends FormComponent {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
    };
  }

  handleLogin = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.props.loginAction(this.state.password);
  }

  componentDidUpdate() {
    const { vault } = this.props;
    if (vault.loginErrorMsg) {
      const password = document.querySelector('[name=password]');
      password.setCustomValidity(vault.loginErrorMsg);
      password.reportValidity();
    }
  }

  render() {
    return (
      <div>
        <div className={style.logo}>
          <AnimatedLogo />
          <h1>Live by ADS</h1>
          {config.testnet ? <h3>TESTNET</h3> : ''}
        </div>
        <Form onSubmit={this.handleLogin}>
          <label htmlFor="password">
            Password
            <input
              type="password"
              autoFocus
              name="password"
              value={this.state.password}
              onChange={this.handlePasswordChange}
            />
          </label>
          <Button type="submit" layout="primary">
            Login
          </Button>
        </Form>
        <div className={style.links}>
          <Link to={'/restore'}>Restore the vault from a seed</Link><br />
          {config.testnet ?
            <Link to={'/mainnet'}>Switch to the mainnet</Link> :
            <Link to={'/testnet'}>Switch to the testnet</Link>
          }
        </div>
      </div>
    );
  }
}

LoginPage.propTypes = {
  loginAction: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  vault: PropTypes.object.isRequired,
};
