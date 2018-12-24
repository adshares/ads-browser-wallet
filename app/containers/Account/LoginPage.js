import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { InvalidPasswordError } from '../../actions/errors';
import FormComponent from '../../components/FormComponent';
import Form from '../../components/atoms/Form';
import Button from '../../components/atoms/Button';
import Logo from '../../components/Logo/Logo';
import style from './LoginPage.css';
import config from '../../config/config'

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
    try {
      this.props.loginAction(this.state.password);
      this.props.history.push(this.getReferrer());
    } catch (err) {
      if (err instanceof InvalidPasswordError) {
        const password = document.querySelector('[name=password]');
        password.setCustomValidity(err.message);
        password.reportValidity();
      } else {
        throw err;
      }
    }
  }

  render() {
    return (
      <div className={style.page}>
        <div className={style.logo}>
          <Logo withoutName />
          <h1>Live by ADS</h1>
          {config.testnet ? <h3>TESTNET</h3> : ''}
        </div>
        <Form onSubmit={this.handleLogin}>
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
          <Button type="submit" icon="right" layout="info">
            Login <FontAwesomeIcon icon={faChevronRight} />
          </Button>
        </Form>
        <div className={style.links}>
          <Link to={'/restore'}>Restore the account from a seed</Link><br />
          {config.testnet ?
            <Link to={'/mainnet'} className={style.mainnetLink}>Switch to the mainnet</Link> :
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
};
