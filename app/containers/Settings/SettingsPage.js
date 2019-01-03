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

  constructor(props) {
    super(props);
    this.state = {
      isSeedPhraseVisible: false,
    };
  }

  renderKeysSettings() {
    return (
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
    );
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
                <ButtonLink
                  to={{
                    pathname: `/accounts/${account.address}/keys`,
                    state: { referrer: this.props.history.location }
                  }}
                  size="small"
                  layout="warning"
                  title="Show account keys"
                ><FontAwesomeIcon icon={faKey} /></ButtonLink>
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

  renderWalletSettings() {
    return (
      <div className={style.section}>
        <h3>Wallet settings</h3>
        <p>
          <ButtonLink
            to={{
              pathname: '/password',
              state: { referrer: this.props.history.location }
            }}
            size="wide"
            title="Change password"
            layout="info"
            icon="left"
          ><FontAwesomeIcon icon={faKey} /> Change password </ButtonLink>
        </p>
        <p>
          <ButtonLink
            to={{
              pathname: '/seedPhrase',
              state: { referrer: this.props.location }
            }}
            size="wide"
            title="Reveal seed phrase"
            layout="warning"
            icon="left"
          ><FontAwesomeIcon icon={faShieldAlt} /> Reveal seed phrase</ButtonLink>
        </p>
        <p>
          <Button
            layout="danger" icon="left" size="wide" onClick={() => {
              this.props.actions.eraseInit();
              this.props.actions.toggleGlobalAuthorisationDialog(true);
            }}
          >
            <FontAwesomeIcon icon={faTrashAlt} /> Erase storage
          </Button>
        </p>
      </div>
    );
  }

  render() {
    return (
      <Page className={style.page} title="Settings" scroll cancelLink={this.getReferrer()}>
        {this.renderKeysSettings()}
        {this.renderAccountsSettings()}
        {this.renderWalletSettings()}
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
