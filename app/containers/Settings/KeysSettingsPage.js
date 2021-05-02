import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faKey, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { generateKeys, removeKey, SETTINGS } from '../../actions/settingsActions';
import Page from '../../components/Page/Page';
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
            <span className={style.accountLabel}>
              <small>{key.name}</small>
              <span>
                {key.publicKey.substr(0, 8)}…{key.publicKey.substr(key.publicKey.length - 8)}
              </span>
            </span>
            <span className={style.accountActions}>
              <ButtonLink
                to={{
                  pathname: `/settings/keys/${key.publicKey}`,
                  state: { referrer: this.props.history.location }
                }}
                size="small"
                layout="warning"
                title="Show keys"
              ><FontAwesomeIcon icon={faKey} /></ButtonLink>
              {removable && (
                <Button
                  onClick={() => this.removeKeyAction(key.publicKey)}
                  size="small"
                  layout="danger"
                  title="Delete key"
                ><FontAwesomeIcon icon={faTrashAlt} /></Button>
              )}
            </span>
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
      >
        <div className={style.section}>
          <h3>Imported</h3>
          {this.renderKeys(importedKeys, true)}
          <ButtonLink
            to={{
              pathname: '/settings/keys/import',
              state: { referrer: this.props.history.location }
            }}
            icon="left"
            size="wide"
            layout="info"
            disabled={page.isSubmitted}
          >
            <FontAwesomeIcon icon={faPlus} /> Import new key
          </ButtonLink>
        </div>
        <div className={style.section}>
          <h3>Generated</h3>
          {this.renderKeys(generatedKeys)}
          <Button
            onClick={() => this.generateKeysAction()}
            icon="left"
            size="wide"
            layout="info"
            disabled={page.isSubmitted}
          >
            <FontAwesomeIcon icon={faPlus} /> Generate more keys
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
