import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Form from '../components/atoms/Form';
import Button from '../components/atoms/Button';
import Logo from '../components/Logo';
import style from './LoginPage.css';

export default class LoginPage extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      password: '',
    };
    // This binding is necessary to make `this` work in the callback
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleInputChange(event, callback) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    }, callback);
  }

  handleLogin(event) {
    event.preventDefault();
    event.stopPropagation();
    this.props.loginAction(this.state.password);
    this.props.history.push('/');
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
              onChange={this.handleInputChange}
            />
          </div>
          <Button type="subbmit">Login</Button>
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
