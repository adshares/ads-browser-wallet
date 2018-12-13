import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamation, faTimes } from '@fortawesome/free-solid-svg-icons/index';
import FormComponent from '../../components/FormComponent';
import Form from '../../components/atoms/Form';
import ButtonLink from '../../components/atoms/ButtonLink';
import Box from '../../components/atoms/Box';
import Footer from '../../components/Footer/Footer';
import ADS from '../../utils/ads';
import style from './SettingsPage.css';

export default class KeyPage extends FormComponent {

  render() {
    const { id } = this.props.match.params;
    const account = this.props.vault.accounts.find(a => a.address === id);
    const signature = ADS.sign('', account.publicKey, account.secretKey);

    return (
      <div className={style.page}>
        <div className={style.header}>
          <h1>{account.address}</h1>
          <ButtonLink to={this.getReferrer()} size="small" inverse>
            <FontAwesomeIcon icon={faTimes} />
          </ButtonLink>
        </div>
        <div className={style.contentWrapper}>
          {!account ? (
            <Box layout="danger" icon={faExclamation}>
              Cannot find the account {account.address} in storage.
            </Box>
            ) :
            (
              <Form>
                <Box layout="warning" icon={faExclamation}>
                  Store the secret keys safely. Only the public key and signatures can be revealed.
                  The secret key must not be transferred to anyone.
                </Box>
                <div>
                  Secret key:
                  <textarea
                    value={account.secretKey}
                    readOnly
                  />
                </div>
                <div>
                  Public key:
                  <textarea
                    value={account.publicKey}
                    readOnly
                  />
                </div>
                <div>
                  Signature of an empty string:
                  <textarea
                    value={signature}
                    rows="4"
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

KeyPage.propTypes = {
  history: PropTypes.object.isRequired,
  vault: PropTypes.object.isRequired,
};

