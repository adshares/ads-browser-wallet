import React from 'react';
import PropTypes from 'prop-types';
import Page from '../../components/Page/Page';
import style from './HomePage.css';

export default class HomePage extends React.PureComponent {

  render() {
    const { vault, logoutAction } = this.props;

    return (
      <Page className={style.page} logoutAction={logoutAction}>
        <section>
          <h2>
            Home
          </h2>

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
      </Page>
    );
  }
}

HomePage.propTypes = {
  vault: PropTypes.object.isRequired,
  logoutAction: PropTypes.func.isRequired,
};
