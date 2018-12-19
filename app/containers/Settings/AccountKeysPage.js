import React from 'react';
import PropTypes from 'prop-types';
import { faExclamation } from '@fortawesome/free-solid-svg-icons/index';
import FormComponent from '../../components/FormComponent';
import { ItemNotFound } from '../../actions/errors';
import Form from '../../components/atoms/Form';
import Box from '../../components/atoms/Box';
import Page from '../../components/Page/Page';
import style from './SettingsPage.css';
import FormControl from '../../components/atoms/FormControl';

export default class AccountKeysPage extends FormComponent {
  render() {
    const { address } = this.props.match.params;
    const account = this.props.vault.accounts.find(a => a.address === address);

    if (!account) {
      throw new ItemNotFound('account', address);
    }

    return (
      <Page className={style.page} title={account.name} smallTitle cancelLink={this.getReferrer()}>
        {!account ? (
          <Box layout="danger" icon={faExclamation} className={style.infoBox}>
            Cannot find the account {account.address} in storage.
          </Box>) : (
            <Form>
              <Box layout="warning" icon={faExclamation} className={style.infoBox}>
                Store the secret keys safely. Only the public key and signatures can be revealed.
                The secret key must not be transferred to anyone.
              </Box>

              <FormControl label="Account address" readOnly rows={1} value={account.address} />
              <FormControl label="Public key" readOnly value={account.publicKey} />
              <FormControl label="Secret key" readOnly value={account.secretKey} />
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

