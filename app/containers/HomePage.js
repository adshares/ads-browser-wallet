import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default class HomePage extends React.PureComponent {

  render() {
    return (
      <div>
        <Header />
        <section>
          <h1>
            Home
          </h1>
          <Link to={'/login'}>Login</Link>&nbsp;
          <Link to={'/restore'}>Restore</Link>&nbsp;
          <Link to={'/register'}>Register</Link>
        </section>
        <Footer />
      </div>
    );
  }
}
