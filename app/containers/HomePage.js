import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import style from './HomePage.css';

export default class HomePage extends React.PureComponent {

  render() {
    const vault = this.props.vault;

    return (
      <div className={style.page}>
        <Header />
        <section>
          <h1>
            Home
          </h1>
          <Link to={'/login'}>Login</Link>&nbsp;
          <Link to={'/restore'}>Restore</Link>&nbsp;
          <Link to={'/register'}>Register</Link>
        </section>
        <hr />
        <div className={style.tableWrapper}>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>PK</th>
                <th>SK</th>
              </tr>
            </thead>
            <tbody>
              {vault.keys.map((key, index) =>
                <tr key={index}>
                  <td>{key.name}</td>
                  <td>{key.publicKey}</td>
                  <td>{key.secretKey}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Footer />
      </div>
    );
  }
}

HomePage.propTypes = {
  history: PropTypes.object.isRequired,
  vault: PropTypes.object.isRequired,
};
