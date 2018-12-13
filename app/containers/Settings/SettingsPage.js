import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShieldAlt,
  faTimes,
  faTrashAlt,
  faSave,
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

  constructor(props) {
    super(props);
    this.state = {
      rpcServer: 'https://rpc.adsahres.net',
      isSeedPhraseVisible: false,
    };
  }

  handleRpcServerSave = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  showSeedPhrase = () => {
    this.setState({
      isSeedPhraseVisible: true
    });
  };

  removeAccount = (address) => {
    const password = '';
    this.props.actions.removeAccount(address, password);
  };

  renderAccountsSettings() {
    return (
      <div className={style.section}>
        <h3>Accounts</h3>
        {this.props.vault.accounts.length &&
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
                    state: { referrer: this.props.location }
                  }}
                  size="small"
                  title="Edit account"
                ><FontAwesomeIcon icon={faPencilAlt} /></ButtonLink>
                <ButtonLink
                  to={{
                    pathname: `/accounts/${account.address}/keys`,
                    state: { referrer: this.props.location }
                  }}
                  size="small"
                  layout="warning"
                  title="Show account keys"
                ><FontAwesomeIcon icon={faKey} /></ButtonLink>
                <Button
                  onClick={() => this.removeAccount(account.address)}
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
            state: { referrer: this.props.location }
          }}
          icon="left"
          size="wide"
        >
          <FontAwesomeIcon icon={faPlus} /> Add account
        </ButtonLink>
      </div>
    );
  }

  renderRPCServerSettings() {
    return (
      <div className={style.section}>
        <h3>RPC server</h3>
        <Form onSubmit={this.handleRpcServerSave}>
          <div>
            <input
              required
              placeholder="RPC server URL"
              name="rpcServer"
              value={this.state.rpcServer}
              onChange={this.handleInputChange}
            />
          </div>
          <Button type="submit" icon="left" size="wide">
            <FontAwesomeIcon icon={faSave} /> Change
          </Button>
        </Form>
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
            <Button layout="danger" icon="left" size="wide" onClick={this.showSeedPhrase}>
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
        <Button layout="danger" icon="left" size="wide" onClick={this.props.actions.ereaseAction}>
          <FontAwesomeIcon icon={faTrashAlt} /> Erase storage
        </Button>
      </div>
    );
  }

  render() {
    const { logoutAction } = this.props;
    return (
      <Page
        title="Settings" scroll
        cancelLink="/"
        logoutAction={logoutAction}
      >
        {this.renderAccountsSettings()}
        {this.renderRPCServerSettings()}
        {this.renderSeedPhraseSettings()}
        {this.renderStorageSettings()}
      </Page>
    );
  }
}

SettingsPage.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  vault: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
};
