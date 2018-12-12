import React from 'react';
import PropTypes from 'prop-types';
import Footer from '../../components/Footer/Footer';
import style from './HomePage.css';

export default class HomePage extends React.PureComponent {

  render() {
    const vault = this.props.vault;

    return (
      <div className={style.page}>
        <section>
          <h1>
            Home
          </h1>

        </section>
        <hr />
        <div className={style.tableWrapper}>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Address</th>
                <th>PK</th>
              </tr>
            </thead>
            <tbody>
              {vault.accounts.map((account, index) =>
                <tr key={index}>
                  <td>{account.name}</td>
                  <td>{account.address}</td>
                  <td>{account.publicKey}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
  ereaseAction: PropTypes.func.isRequired,
};
