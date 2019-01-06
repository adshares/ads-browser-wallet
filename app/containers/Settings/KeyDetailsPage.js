import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamation, faChevronLeft } from '@fortawesome/free-solid-svg-icons/index';
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

    if (!key) {
      return this.renderNotFoundErrorPage('key', publicKey);
    }

    const isConfirmed = authDialog.isConfirmed && authDialog.name === 'keyDetails';
    const secretKey = isConfirmed ?
      key.secretKey :
      ''.padStart(64, 'X')
    ;
    const signature = isConfirmed ?
      ADS.sign('', key.publicKey, key.secretKey) :
      ''.padStart(128, 'X')
    ;

    return (
      <Page
        className={style.page}
        title={`Key '${key.name}'`}
        cancelLink={this.getReferrer('/settings')}
      >
        <Form>
          <Box layout="warning" icon={faExclamation}>
            Store the secret keys safely. Only the public key and signatures can be revealed.
            The secret key must not be transferred to anyone.
          </Box>
          <InputControl
            value={publicKey}
            rows={2}
            readOnly
            label="Public key"
          />
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
          <ButtonLink
            to={this.getReferrer()}
            icon="left"
            layout="info"
            size="wide"
          >
            <FontAwesomeIcon icon={faChevronLeft} /> Back
          </ButtonLink>
        </Form>
      </Page>
    );
  }
}

export default connect(
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
)(KeyDetailsPage);
