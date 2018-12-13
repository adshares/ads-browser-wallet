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
      const location = this.props.location.state.referrer || '/';
      this.props.history.push(location);
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
          <Logo />
          <h1>Live by ADS</h1>
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
          <Button type="submit" icon="right">
            Login <FontAwesomeIcon icon={faChevronRight} />
          </Button>
        </Form>
        <div className={style.restore}>
          <Link to={'/restore'}>Restore the account from a seed</Link>
        </div>
      </div>
    );
  }
}

LoginPage.propTypes = {
  loginAction: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};
