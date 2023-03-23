import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { secretDataAccess } from '../../actions/settingsActions';
import ADS from '../../utils/ads';
import Form from '../../components/atoms/Form';
import Box from '../../components/atoms/Box';
import Page from '../../components/Page/Page';
import InputControl from '../../components/atoms/InputControl';
import PageComponent from '../../components/PageComponent';
import ButtonLink from '../../components/atoms/ButtonLink';
import style from './SettingsPage.css';

class KeyDetailsPage extends PageComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    vault: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.props.actions.secretDataAccess('keyDetails');
  }

  render() {
    const { vault, authDialog } = this.props;
    const { publicKey } = this.props.match.params;
    const key = vault.keys.find(k => k.publicKey === publicKey);

    let title = 'Unknown key';
    let secretKey = null;
    let signature = null;

    if (key) {
      title = `Key ${key.name}`;
      secretKey = ''.padStart(64, 'X');
      signature = ''.padStart(128, 'X');
      if (authDialog.isConfirmed && authDialog.name === 'keyDetails') {
        secretKey = key.secretKey;
        signature = ADS.sign('', key.publicKey, key.secretKey);
      }
    }

    return (
      <Page
        className={style.page}
        title={title}
        cancelLink={this.getReferrer('/settings')}
        scroll
      >
        <Form>
          {secretKey ?
            <Box layout="warning" icon={'!'}>
              Store the secret keys safely. Only the public key and signatures can be revealed.
              The secret key must not be transferred to anyone.
            </Box> :
            <Box layout="warning" icon={'!'}>
              Cannot find key in the storage. Please import a secret key first.
            </Box>
          }
          <InputControl
            value={publicKey}
            rows={2}
            readOnly
            label="Public key"
          />
          {secretKey &&
            <React.Fragment>
              <InputControl
                value={secretKey}
                rows={2}
                readOnly
                label="Secret key"
              />
              <InputControl
                value={signature}
                rows={3}
                readOnly
                label="Signature of an empty string"
              />
            </React.Fragment>
          }
          <ButtonLink
            to={this.getReferrer()}
            layout="primary"
            size="wide"
          >Back
          </ButtonLink>
        </Form>
      </Page>
    );
  }
}

export default withRouter(connect(
  state => ({
    vault: state.vault,
    authDialog: state.authDialog,
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        secretDataAccess,
      }, dispatch)
  })
)(KeyDetailsPage));
