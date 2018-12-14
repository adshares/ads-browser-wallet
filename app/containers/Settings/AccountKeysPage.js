import React from 'react';
import PropTypes from 'prop-types';
import { faExclamation } from '@fortawesome/free-solid-svg-icons/index';
import FormComponent from '../../components/FormComponent';
import { ItemNotFound } from '../../actions/errors';
import Form from '../../components/atoms/Form';
import Box from '../../components/atoms/Box';
import Page from '../../components/Page/Page';
import style from './SettingsPage.css';

export default class AccountKeysPage extends FormComponent {
  render() {
    const { address } = this.props.match.params;
    const account = this.props.vault.accounts.find(a => a.address === address);

    if (!account) {
      throw new ItemNotFound('account', address);
    }

    return (
      <Page title={account.name} smallTitle cancelLink={this.getReferrer()}>
        {!account ? (
          <Box layout="danger" icon={faExclamation} className={style.infoBox}>
            Cannot find the account {account.address} in storage.
          </Box>) : (
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
      </Page>
    );
  }
}

AccountKeysPage.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  vault: PropTypes.object.isRequired,
};

