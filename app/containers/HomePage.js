import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import style from './HomePage.css';
import * as VaultActions from '../actions/vault';
import KeyBox from '../utils/keybox'

export default class HomePage extends React.PureComponent {

  constructor(props) {
    super(props);
    // This binding is necessary to make `this` work in the callback
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
  }


  handleLogoutClick(event) {
    event.preventDefault();
    event.stopPropagation();
    console.debug('handleLOgoutClick');
    this.props.logoutAction();
  }

  render() {
    const vault = this.props.vault;

    return (
      <div className={style.page}>
        <Header />
        <section>
          <h1>
            Home
          </h1>
          <Link to={'/'} onClick={this.handleLogoutClick} >Logout</Link>
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
  logoutAction: PropTypes.func.isRequired,
};
