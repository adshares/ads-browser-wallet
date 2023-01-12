import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { generateKeys, removeKey, SETTINGS } from '../../actions/settingsActions';
import Page from '../../components/Page/Page';
import { KeyIcon, BinIcon, PlusIcon } from '../../components/icons/Icons';
import PageComponent from '../../components/PageComponent';
import ButtonLink from '../../components/atoms/ButtonLink';
import Button from '../../components/atoms/Button';
import style from './SettingsPage.css';

class KeysSettingsPage extends PageComponent {
  static propTypes = {
    history: PropTypes.object.isRequired,
    vault: PropTypes.object.isRequired,
    page: PropTypes.object.isRequired,
    actions: PropTypes.shape({
      generateKeys: PropTypes.func.isRequired,
      removeKey: PropTypes.func.isRequired,
    }),
  };

  removeKeyAction = (publicKey) => {
    this.props.actions.removeKey(publicKey);
  };

  generateKeysAction() {
    this.props.actions.generateKeys(1);
  }

  renderKeys(keys, removable = false) {
    if (keys.length === 0) {
      return <div />;
    }

    return (
      <ul className={style.accounts}>
        {keys.map((key, index) =>
          <li key={index} className={style.list}>
            <div className={style.accountLabel}>
              <small>{key.name}</small>
              <span>
                {key.publicKey.substr(0, 8)}…{key.publicKey.substr(key.publicKey.length - 8)}
              </span>
            </div>
            <div className={style.accountActions}>
              <a
                to={{
                  pathname: `/settings/keys/${key.publicKey}`,
                  state: { referrer: this.props.history.location }
                }}
                title="Show keys"
              ><KeyIcon fill="warning" /></a>
              {removable && (
                <span
                  role="button"
                  onClick={() => this.removeKeyAction(key.publicKey)}
                  title="Delete key"
                ><BinIcon fill="primary" /></span>
              )}
            </div>
          </li>
        )}
      </ul>
    );
  }

  render() {
    const { keys } = this.props.vault;
    const { page } = this.props;

    const importedKeys = keys.filter(key => key.type === 'imported');
    const generatedKeys = keys.filter(key => key.type === 'master' || key.type === 'auto');

    return (
      <Page
        className={style.page} title="Keys Settings"
        cancelLink={this.getReferrer()} scroll
        showLoader={page.isSubmitted}
        errorMsg={page.errorMsg}
        hideSelectAccount
      >
        <div className={style.settingsSection}>
          <h3>Imported</h3>
          {this.renderKeys(importedKeys, true)}
          <ButtonLink
            to={{
              pathname: '/settings/keys/import',
              state: { referrer: this.props.history.location }
            }}
            icon="left"
            size="wide"
            layout="primary"
            disabled={page.isSubmitted}
          >
            <PlusIcon fill="light" /> Import new key
          </ButtonLink>
        </div>
        <div className={style.settingsSection}>
          <h3>Generated</h3>
          {this.renderKeys(generatedKeys)}
          <Button
            onClick={() => this.generateKeysAction()}
            icon="left"
            size="wide"
            layout="primary"
            disabled={page.isSubmitted}
          >
            <PlusIcon fill="light" /> Generate more keys
          </Button>
        </div>
      </Page>
    );
  }
}

export default withRouter(connect(
  state => ({
    vault: state.vault,
    page: state.pages[SETTINGS]
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        removeKey,
        generateKeys,
      }, dispatch)
  })
)(KeysSettingsPage));
