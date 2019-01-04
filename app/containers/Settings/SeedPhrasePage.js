import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamation, faChevronLeft } from '@fortawesome/free-solid-svg-icons/index';
import { previewSecretDataInit } from '../../actions/actions';
import Form from '../../components/atoms/Form';
import Box from '../../components/atoms/Box';
import Page from '../../components/Page/Page';
import InputControl from '../../components/atoms/InputControl';
import PageComponent from '../../components/PageComponent';
import ButtonLink from '../../components/atoms/ButtonLink';
import style from './SettingsPage.css';

@connect(
  state => ({
    vault: state.vault,
    authDialog: state.authDialog,
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        previewSecretDataInit,
      }, dispatch)
  })
)
export default class SeedPhrasePage extends PageComponent {

  static propTypes = {
    vault: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.props.actions.previewSecretDataInit();
  }

  render() {
    const { vault, authDialog } = this.props;
    console.debug(authDialog);

    return (
      <Page
        className={style.page}
        title="Seed phrase"
        cancelLink={this.getReferrer()}
      >
        <Form>
          <Box layout="warning" icon={faExclamation}>
            Store the seed phrase safely. The seed phrase must not be transferred to anyone.
          </Box>
          <InputControl
            value={vault.seedPhrase}
            rows={3}
            readOnly
            label="Seed Phrase"
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

  renderFakeBackground = () => (
    <Page
      className={style.page} title="XXXXX XXXX" smallTitle
    >
      <Form>
        <Box layout="warning" icon={faExclamation}>
         Store the seed phrase safely. A seed phrase includes all theinformationneeded to recover a wallet.
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

  renderX() {
    const { vault, authDialog } = this.props;
    console.debug(authDialog);

    return (
      <Page
        className={style.page}
        title="Seed phrase"
        cancelLink={this.getReferrer()}
        showConfirmDialog={!authDialog.authConfirmed}
      >
        <Form>
          <Box layout="warning" icon={faExclamation}>
            Store the seed phrase safely. The seed phrase must not be transferred to anyone.
          </Box>
          <InputControl
            value={vault.seedPhrase}
            rows={3}
            readOnly
            label="Seed Phrase"
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
