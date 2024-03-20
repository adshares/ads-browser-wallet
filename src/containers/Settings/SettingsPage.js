import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShieldAlt,
  faTrashAlt,
  faPlus,
  faPencilAlt,
  faKey,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import {
  removeAccount,
  eraseStorage,
  findAllAccounts,
  SETTINGS
} from '../../actions/settingsActions';
import FormComponent from '../../components/FormComponent';
import Page from '../../components/Page/Page';
import Button from '../../components/atoms/Button';
import ButtonLink from '../../components/atoms/ButtonLink';
import style from './SettingsPage.module.css';
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
      <div className={style.section}>
        <h3>Keys</h3>
        <ButtonLink
          to={{
            pathname: '/settings/keys',
            state: { referrer: this.props.history.location }
          }}
          size="wide"
          title="Manage Keys"
          layout="info"
          icon="left"
        ><FontAwesomeIcon icon={faPencilAlt} /> Manage keys</ButtonLink>
      </div>
    );
  }

  renderAccountRow(account) {
    return (
      <React.Fragment>
        <span className={style.accountLabel}>
          <small>{account.name}</small>
          <span>{account.address}</span>
        </span>
        <span className={style.accountActions}>
          <ButtonLink
            to={{
              pathname: `/settings/accounts/${account.address}/edit`,
              state: { referrer: this.props.history.location }
            }}
            size="small"
            title="Edit account"
            layout="info"
          ><FontAwesomeIcon icon={faPencilAlt} /></ButtonLink>
          <ButtonLink
            to={{
              pathname: `/settings/keys/${account.publicKey}`,
              state: { referrer: this.props.history.location }
            }}
            size="small"
            title={account.publicKey ? 'Show account keys' : 'Cannot find keys. The account may not have been registered yet.'}
            layout="warning"
            disabled={!account.publicKey}
          ><FontAwesomeIcon icon={faKey} /></ButtonLink>
          <Button
            onClick={() => this.removeAccountAction(account.address)}
            size="small"
            title="Delete account"
            layout="danger"
          ><FontAwesomeIcon icon={faTrashAlt} /></Button>
        </span>
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
      <div className={style.section}>
        <h3>Accounts</h3>
        {this.props.vault.accounts.length > 0 &&
          <ul className={style.accounts}>
            {this.props.vault.accounts.map((account, index) =>
              <li className={style.list} key={index}>{this.renderAccountRow(account)}</li>
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
          layout="info"
          icon="left"
          disabled={isSubmitted}
        >
          <FontAwesomeIcon icon={faPlus} /> Add account
        </ButtonLink>
        <p>
          <Button
            onClick={this.handleFindAllAccountsClick}
            size="wide"
            title="Find accounts"
            layout="success"
            icon="left"
            disabled={isSubmitted}
          >
            <FontAwesomeIcon icon={faSearch} /> Find accounts
            { isAccountsImported && <small> (<b>{accountsCount}</b> accounts found)</small> }
          </Button>
        </p>
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
              pathname: '/settings/change_password',
              state: { referrer: this.props.history.location }
            }}
            size="wide"
            title="Change password"
            layout="info"
            icon="left"
          >
            <FontAwesomeIcon icon={faKey} /> Change password
          </ButtonLink>
        </p>
        <p>
          <ButtonLink
            to={{
              pathname: '/settings/seedPhrase',
              state: { referrer: this.props.history.location }
            }}
            size="wide"
            title="Reveal seed phrase"
            layout="warning"
            icon="left"
          >
            <FontAwesomeIcon icon={faShieldAlt} /> Reveal seed phrase
          </ButtonLink>
        </p>
        <p>
          <Button
            onClick={() => this.eraseStorageAction()}
            size="wide"
            title="Erase storage"
            layout="danger"
            icon="left"
          >
            <FontAwesomeIcon icon={faTrashAlt} /> Erase storage
          </Button>
        </p>
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

