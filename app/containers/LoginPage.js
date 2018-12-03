import React from 'react';
import { Link } from 'react-router-dom';
import Form from '../components/atoms/Form';
import Button from '../components/atoms/Button';
import style from './LoginPage.css';

export default class LoginPage extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      isToggleOn: true
    };
    // This binding is necessary to make `this` work in the callback
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin(event) {
    this.setState(state => ({
      isToggleOn: !state.isToggleOn
    }));
    event.preventDefault();
  }

  render() {
    return (
      <div className={style.page}>
        <div className={style.logo}>
          <img alt="Adshares" src="img/logo.svg" />
          <h1>Live by ADS</h1>
        </div>
        <Form onSubmit={this.handleLogin}>
          <div>
            <input type="password" name="password" autoFocus required placeholder="Password" />
          </div>
          <Button type="subbmit">Log{this.state.isToggleOn ? 'in' : 'out'}</Button>
        </Form>
        <div className={style.restore}>
          <Link to={'/restore'}>Restore the account from a seed</Link>
        </div>
      </div>
    );
  }
}
