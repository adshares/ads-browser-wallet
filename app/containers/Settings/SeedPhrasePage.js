import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { secretDataAccess } from '../../actions/settingsActions';
import Form from '../../components/atoms/Form';
import Box from '../../components/atoms/Box';
import Page from '../../components/Page/Page';
import InputControl from '../../components/atoms/InputControl';
import PageComponent from '../../components/PageComponent';
import ButtonLink from '../../components/atoms/ButtonLink';
import style from './SettingsPage.css';

class SeedPhrasePage extends PageComponent {
  static propTypes = {
    vault: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.props.actions.secretDataAccess('seedPhrase');
  }

  render() {
    const { vault, authDialog } = this.props;
    let seedPhrase = ''.padStart(86, 'X');
    if (authDialog.isConfirmed && authDialog.name === 'seedPhrase') {
      seedPhrase = vault.seedPhrase;
    }

    return (
      <Page
        className={style.page}
        title="Seed phrase"
        cancelLink={this.getReferrer('/settings')}
        hideSelectAccount
      >
        <Form>
          <Box layout="warning" icon={'!'}>
            Store the seed phrase safely. The seed phrase must not be transferred to anyone.
          </Box>
          <InputControl
            value={seedPhrase}
            rows={3}
            readOnly
            label="Seed Phrase"
          />
          <ButtonLink
            to={this.getReferrer()}
            layout="secondary"
          >Back</ButtonLink>
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
)(SeedPhrasePage));
