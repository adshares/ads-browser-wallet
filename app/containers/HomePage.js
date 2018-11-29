import React from 'react';
import { Link } from 'react-router-dom';

export default class HomePage extends React.PureComponent {

  render() {
    return (
      <div>
        <h1>
          Home
        </h1>
        <Link to={'/login'}>Login</Link>&nbsp;
        <Link to={'/restore'}>Restore</Link>&nbsp;
        <Link to={'/register'}>Register</Link>
      </div>
    );
  }
}
