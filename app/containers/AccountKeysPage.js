import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamation, faTimes } from '@fortawesome/free-solid-svg-icons/index';
import FormPage from '../components/FormPage';
import Form from '../components/atoms/Form';
import ButtonLink from '../components/atoms/ButtonLink';
import Box from '../components/atoms/Box';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import style from './SettingsPage.css';

export default class AccountKeysPage extends FormPage {

  render() {
    const { address } = this.props.match.params;
    const account = this.props.vault.accounts.find(a => a.address === address);

    return (
      <div className={style.page}>
        <Header />
        <div className={style.header}>
          <h1>{account.name} keys</h1>
          <ButtonLink to={this.getReferrer()} size="small" inverse>
            <FontAwesomeIcon icon={faTimes} />
          </ButtonLink>
        </div>
        <div className={style.contentWrapper}>
          {!account ? (
            <Box layout="danger" icon={faExclamation} className={style.infoBox}>
              Cannot find the account {account.address} in storage.
            </Box>
            ) :
            (
              <Form>
                <Box layout="warning" icon={faExclamation} className={style.infoBox}>
                  Store the secret keys safely. Only the public key and signatures can be revealed.
                  The secret key must not be transferred to anyone.
                </Box>
                <div>
                  Account address:
                  <textarea
                    value={account.address}
                    readOnly
                    rows="1"
                  />
                </div>
                <div>
                  Public key:
                  <textarea
                    value={account.publicKey}
                    readOnly
                  />
                </div>
                <div className={style.dangerContent}>
                  Secret key:
                  <textarea
                    value={account.secretKey}
                    readOnly
                  />
                </div>
              </Form>
            )
          }
        </div>
        <Footer />
      </div>
    );
  }
}

AccountKeysPage.propTypes = {
  history: PropTypes.object.isRequired,
  vault: PropTypes.object.isRequired,
};

