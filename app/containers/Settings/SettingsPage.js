import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShieldAlt,
  faTrashAlt,
  faExclamation,
  faPlus,
  faPencilAlt,
  faKey,
} from '@fortawesome/free-solid-svg-icons';
import FormComponent from '../../components/FormComponent';
import Form from '../../components/atoms/Form';
import Button from '../../components/atoms/Button';
import ButtonLink from '../../components/atoms/ButtonLink';
import Box from '../../components/atoms/Box';
import style from './SettingsPage.css';
import Page from '../../components/Page/Page';

export default class SettingsPage extends FormComponent {

  handleRpcServerSave = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  showSeedPhrase = () => {
    this.setState({
      isSeedPhraseVisible: true
    });
  };

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

  renderSeedPhraseSettings() {
    return (
      <div className={style.section}>
        <h3>Reveal seed phrase</h3>
        <Form>
          {this.state.isSeedPhraseVisible ?
            <div>
              <Box layout="warning" icon={faExclamation}>
                Store the seed phrase safely. Only the public key and signatures can be revealed.
                The seed phrase must not be transferred to anyone.
              </Box>
              <textarea
                value={this.props.vault.seedPhrase}
                rows="3"
                readOnly
              />
            </div> :
            <Button layout="warning" icon="left" size="wide" onClick={this.showSeedPhrase}>
              <FontAwesomeIcon icon={faShieldAlt} /> Reveal seed phrase
            </Button>
          }
        </Form>
      </div>
    );
  }

  renderStorageSettings() {
    return (
      <div className={style.section}>
        <h3>Erase storage</h3>
        <Button layout="danger" icon="left" size="wide" onClick={() => {
          this.props.actions.eraseInit();
          this.props.actions.toggleGlobalAuthorisationDialog(true);
        }}>
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
        {this.renderSeedPhraseSettings()}
        {this.renderStorageSettings()}
      </Page>
    );
  }
}

SettingsPage.propTypes = {
  history: PropTypes.object.isRequired,
  vault: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
};
