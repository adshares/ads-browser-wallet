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

class DetailsPage extends PageComponent {

  constructor(props) {
    super(props);
    this.state = {
      showProtectedContent: false
    };
  }


  componentDidMount() {
    this.props.previewSecretData();
    this.props.toggleAuthDialog(true);
  }

  renderContent() {
    const { accounts, type, keys, seed } = this.props;
    const { address, publicKey } = this.props.match.params;
    const chosenAccount = type === 'account' && accounts.find(a => a.address === address);
    const seedPhrase = type === 'seed';
    let pk;
    if (type === 'key') {
      pk = publicKey;
    } else if (type === 'account') {
      pk = chosenAccount.publicKey;
    }
    const key = pk && keys.find(k => k.publicKey === pk);
    const chosenElement = chosenAccount || key || seedPhrase;
    const signature = type === 'key' && ADS.sign('', key.publicKey, key.secretKey);

    return (
      <Page
        className={style.page} title={chosenElement.name} smallTitle
        cancelLink={this.getReferrer()} scroll
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
            <InputControl label="Secret key" readOnly value={key.secretKey} />
            {type === 'key' && (
              <InputControl label="Signature" readOnly rows={4} value={signature} />
            )}
          </Form>
        )))
        }
      </Page>
    );
  }

  renderFakeBackground = () => (
    <Page
      className={style.page} title="XXXXX XXXX" smallTitle
    >
      <Form>
        <Box layout="warning" icon={faExclamation}>
             Store the seed phrase safely. Only the public key and signatures can be revealed.
             The seed phrase must not be transferred to anyone.
           </Box>
        <InputControl
          value="XXXX XXXXX XXXX" rows={1} readOnly label="XXXXXX XXXXX"
        />
        <InputControl
          value="XXXX XXXXX XXXX" rows={1} readOnly label="XXXXXX XXXXX"
        />
        <InputControl
          value="XXXX XXXXX XXXX" rows={1} readOnly label="XXXXXX XXXXX"
        />
      </Form>
    </Page>
     );

  render() {
    return (
      <div
        className={style.pageContainer}
      >
        {this.props.authConfirmed ? this.renderContent() : this.renderFakeBackground()}

      </div>
    );
  }
}

export default DetailsPage;

DetailsPage.propTypes = {
  type: PropTypes.string.isRequired,
  accounts: PropTypes.array,
  selectedAccount: PropTypes.string,
  keys: PropTypes.array,
  toggleAuthDialog: PropTypes.func.isRequired,
  previewSecretData: PropTypes.func.isRequired,
  authConfirmed: PropTypes.bool,
};

