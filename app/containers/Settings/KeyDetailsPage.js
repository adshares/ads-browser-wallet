import React from 'react';
import PropTypes from 'prop-types';
import { faExclamation } from '@fortawesome/free-solid-svg-icons/index';
import Form from '../../components/atoms/Form';
import Box from '../../components/atoms/Box';
import ADS from '../../utils/ads';
import style from './SettingsPage.css';
import Page from '../../components/Page/Page';
import InputControl from '../../components/atoms/InputControl';
import PageComponent from '../../components/PageComponent';

class KeyDetailsPage extends PageComponent {

  render() {
    const { accounts, type, keys, seed } = this.props;
    const { address, pk } = this.props.match.params;
    const chosenAccount = type === 'account' && accounts.find(a => a.address === address);
    const key = type === 'key' && keys.find(k => k.publicKey === pk);
    const seedPhrase = type === 'seed';
    const chosenElement = chosenAccount || key || seedPhrase;
    const signature = type === 'key' && ADS.sign('', key.publicKey, key.secretKey);

    return (
      <Page
        className={style.page} title={chosenElement.name} smallTitle
        cancelLink={this.getReferrer()}
      >
        {!chosenElement && (
          <Box layout="danger" icon={faExclamation} className={style.infoBox}>
            Cannot find chosen {type} in storage.
          </Box>)}
        {(chosenElement && (type === 'seed' ? (
          <Form>
            <Box layout="warning" icon={faExclamation}>
              Store the seed phrase safely. Only the public key and signatures can be revealed.
              The seed phrase must not be transferred to anyone.
            </Box>
            <InputControl
              value={seed} rows={3} readOnly label="Seed Phrase"
            />
          </Form>
        ) : (
          <Form>
            <Box layout="warning" icon={faExclamation} className={style.infoBox}>
              Store the secret keys safely. Only the public key and signatures can be revealed.
              The secret key must not be transferred to anyone.
            </Box>
            {type === 'account' && (
              <InputControl
                isInput
                label="Account address" readOnly rows={1}
                value={chosenElement.address}
              />
            )}
            <InputControl label="Public key" readOnly value={chosenElement.publicKey} />
            <InputControl label="Secret key" readOnly value={chosenElement.secretKey} />
            {type === 'key' && (
              <InputControl label="Signature" readOnly rows={4} value={signature} />
            )}
          </Form>
        )))
        }
      </Page>
    );
  }
}

export default KeyDetailsPage;

KeyDetailsPage.propTypes = {
  type: PropTypes.string.isRequired,
  accounts: PropTypes.array,
  selectedAccount: PropTypes.string,
  keys: PropTypes.array,
};

