import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShieldAlt,
  faTrashAlt,
  faPlus,
  faPencilAlt,
  faKey,
} from '@fortawesome/free-solid-svg-icons';
import FormComponent from '../../components/FormComponent';
import Button from '../../components/atoms/Button';
import ButtonLink from '../../components/atoms/ButtonLink';
import style from './SettingsPage.css';
import Page from '../../components/Page/Page';

export default class SettingsPage extends FormComponent {

  removeAccountAction = (address) => {
    this.props.actions.toggleGlobalAuthorisationDialog(true);
    this.props.actions.removeAccountInit(address);
  };

  showProtectedDataAction = (path) => {
    this.props.actions.toggleGlobalAuthorisationDialog(true);
    this.props.actions.previewSecretDataInit(path);
  };

  constructor(props) {
    super(props);
    this.state = {
      isSeedPhraseVisible: false,
    };
  }

  renderAccountsSettings() {
    return (
      <div className={style.section}>
        <h3>Accounts</h3>
        {this.props.vault.accounts.length > 0 &&
        <ul className={style.accounts}>
          {this.props.vault.accounts.map((account, index) =>
            <li key={index}>
              <span className={style.accountLabel}>
                <small>{account.name}</small>
                <span>{account.address}</span>
              </span>
              <span className={style.accountActions}>
                <ButtonLink
                  to={{
                    pathname: `/accounts/${account.address}/edit`,
                    state: { referrer: this.props.history.location }
                  }}
                  size="small"
                  title="Edit account"
                  layout="info"
                ><FontAwesomeIcon icon={faPencilAlt} /></ButtonLink>
                <Button
                  onClick={() => this.showProtectedDataAction(`/accounts/${account.address}/keys`)}
                  size="small"
                  layout="warning"
                  title="Show account keys"
                ><FontAwesomeIcon icon={faKey} /></Button>
                <Button
                  onClick={() => this.removeAccountAction(account.address)}
                  size="small"
                  layout="danger"
                  title="Delete account"
                ><FontAwesomeIcon icon={faTrashAlt} /></Button>
              </span>
            </li>
          )}
        </ul>
        }
        <ButtonLink
          to={{
            pathname: '/accounts/import',
            state: { referrer: this.props.history.location }
          }}
          icon="left"
          size="wide"
          layout="info"
        >
          <FontAwesomeIcon icon={faPlus} /> Add account
        </ButtonLink>
      </div>
    );
  }

  renderStorageSettings() {
    return (
      <div className={style.section}>
        <h3>Erase storage</h3>
        <Button
          layout="danger" icon="left" size="wide" onClick={() => {
            this.props.actions.eraseInit();
            this.props.actions.toggleGlobalAuthorisationDialog(true);
          }}
        >
          <FontAwesomeIcon icon={faTrashAlt} /> Erase storage
        </Button>
      </div>
    );
  }

  render() {
    return (
      <Page className={style.page} title="Settings" scroll cancelLink="/">
        <div className={style.section}>
          <h3>Keys</h3>
          <ButtonLink
            to={{
              pathname: '/keys',
              state: { referrer: this.props.location }
            }}
            size="wide"
            title="Edit account"
            layout="info"
            icon="left"
          ><FontAwesomeIcon icon={faPencilAlt} /> Manage Keys</ButtonLink>
        </div>
        {this.renderAccountsSettings()}
        <div className={style.section}>
          <h3>Reveal seed phrase</h3>
          <Button
            onClick={() => this.showProtectedDataAction('/seedPhrase')}
            size="wide"
            title="Reveal seed phrase"
            layout="warning"
            icon="left"
          ><FontAwesomeIcon icon={faShieldAlt} /> Reveal seed phrase</Button>
        </div>
        {this.renderStorageSettings()}
      </Page>
    );
  }
}

SettingsPage.propTypes = {
  history: PropTypes.object.isRequired,
  vault: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  toggleAuthDialog: PropTypes.func,
};
