import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  removeAccount,
  eraseStorage,
  findAllAccounts,
  SETTINGS
} from '../../actions/settingsActions';
import { BinIcon, FindIcon, InfoShieldIcon, KeyIcon, PencilIcon, PlusIcon } from '../../components/icons/Icons';
import FormComponent from '../../components/FormComponent';
import Page from '../../components/Page/Page';
import Button from '../../components/atoms/Button';
import ButtonLink from '../../components/atoms/ButtonLink';
import style from './SettingsPage.css';
import { cleanForm } from '../../actions/formActions';

class SettingsPage extends FormComponent {
  static propTypes = {
    history: PropTypes.object.isRequired,
    vault: PropTypes.object.isRequired,
    page: PropTypes.object.isRequired,
    actions: PropTypes.shape({
      removeAccount: PropTypes.func.isRequired,
      eraseStorage: PropTypes.func.isRequired,
      findAllAccounts: PropTypes.func.isRequired,
    }),
  };

  componentDidMount() {
    this.props.actions.cleanForm(SETTINGS);
  }

  componentWillUnmount() {
    this.props.actions.cleanForm(SETTINGS);
  }

  removeAccountAction = (address) => {
    this.props.actions.removeAccount(address);
  };

  eraseStorageAction = () => {
    this.props.actions.eraseStorage();
  };

  handleFindAllAccountsClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.props.actions.findAllAccounts();
  };

  renderKeysSettings() {
    return (
      <div className={style.settingsSection}>
        <h3>Keys</h3>
        <ButtonLink
          to={{
            pathname: '/settings/keys',
            state: { referrer: this.props.history.location }
          }}
          size="wide"
          title="Manage Keys"
          layout="primary"
          icon="left"
        ><PencilIcon fill="light" /> Manage keys</ButtonLink>
      </div>
    );
  }

  renderAccountRow(account) {
    return (
      <React.Fragment>
        <div className={style.accountLabel}>
          <small>{account.name}</small>
          <span>{account.address}</span>
        </div>
        <div className={style.accountActions}>
          <a
            to={{
              pathname: `/settings/accounts/${account.address}/edit`,
              state: { referrer: this.props.history.location }
            }}
            title="Edit account"
          ><PencilIcon /></a>
          <a
            to={{
              pathname: `/settings/keys/${account.publicKey}`,
              state: { referrer: this.props.history.location }
            }}
            title={account.publicKey ? 'Show account keys' : 'Cannot find keys. The account may not have been registered yet.'}
            disabled={!account.publicKey}
          ><KeyIcon fill="warning" /></a>
          <a
            onClick={() => this.removeAccountAction(account.address)}
            title="Delete account"
          ><BinIcon fill="primary" /></a>
        </div>
      </React.Fragment>
    );
  }

  renderAccountsSettings() {
    const {
      page: {
        isSubmitted,
        isAccountsImported,
        accountsCount,
      }
    } = this.props;
    return (
      <div className={style.settingsSection}>
        <h3>Accounts</h3>
        {this.props.vault.accounts.length > 0 &&
          <ul className={style.accounts}>
            {this.props.vault.accounts.map((account, index) =>
              <li key={index}>{this.renderAccountRow(account)}</li>
            )}
          </ul>
        }
        <ButtonLink
          to={{
            pathname: '/settings/accounts/import',
            state: { referrer: this.props.history.location }
          }}
          size="wide"
          title="Add account"
          layout="primary"
          icon="left"
          disabled={isSubmitted}
        >
          <PlusIcon fill="light" width={22} />Add account
        </ButtonLink>
        <Button
          onClick={this.handleFindAllAccountsClick}
          size="wide"
          title="Find accounts"
          layout="secondary"
          icon="left"
          disabled={isSubmitted}
        >
          <FindIcon width={22} /> Find accounts
          { isAccountsImported && <small> (<b>{accountsCount}</b> accounts found)</small> }
        </Button>
      </div>
    );
  }

  renderWalletSettings() {
    return (
      <div className={style.settingsSection}>
        <h3>Wallet settings</h3>
        <ButtonLink
          to={{
            pathname: '/settings/change_password',
            state: { referrer: this.props.history.location }
          }}
          size="wide"
          title="Change password"
          layout="primary"
          icon="left"
        >
          <KeyIcon fill="light" /> Change password
        </ButtonLink>
        <ButtonLink
          to={{
            pathname: '/settings/seedPhrase',
            state: { referrer: this.props.history.location }
          }}
          size="wide"
          title="Reveal seed phrase"
          layout="secondary"
          icon="left"
        >
          <InfoShieldIcon /> Reveal seed phrase
        </ButtonLink>
        <Button
          onClick={() => this.eraseStorageAction()}
          size="wide"
          title="Erase storage"
          layout="outline"
          icon="left"
        >
          <BinIcon /> Erase storage
        </Button>
      </div>
    );
  }

  render() {
    const { page } = this.props;
    return (
      <Page
        className={style.page} title="Settings" scroll
        cancelLink={this.getReferrer()}
        showLoader={page.isSubmitted}
        errorMsg={page.errorMsg}
      >
        {this.renderAccountsSettings()}
        {this.renderKeysSettings()}
        {this.renderWalletSettings()}
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
        removeAccount,
        eraseStorage,
        findAllAccounts,
        cleanForm,
      }, dispatch)
  })
)(SettingsPage));

