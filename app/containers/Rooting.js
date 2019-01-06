import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';
import ErrorPage from './ErrorPage';
import HomePage from './Home/HomePage';
import RestorePage from './Account/RestorePage';
import RegisterPage from './Account/RegisterPage';
import LoginPage from './Account/LoginPage';
import SettingsPage from './Settings/SettingsPage';
import PasswordChangePage from './Settings/PasswordEditorPage';
import AccountEditorPage from './Settings/AccountEditorPage';
import KeysImporterPage from './Settings/KeyEditorPage';
import SendOnePage from './Transactions/SendOnePage';
import PendingTransactionsPage from './Transactions/PendingTransactionsPage';
import SignPage from './Transactions/SignPage';
import DetailsPage from './Settings/DetailsPage';
import SeedPhrasePage from './Settings/SeedPhrasePage';
import KeysSettingsPage from './Settings/KeysSettingsPage';
import KeyDetailsPage from './Settings/KeyDetailsPage';
import * as vaultActions from '../actions/vaultActions';
import * as formActions from '../actions/formActions';
import * as settingsActions from '../actions/settingsActions';
import * as commonActions from '../actions/walletActions';
import style from './App.css';
import config from '../config/config';

function NotFoundErrorPage(props) {
  return (
    <ErrorPage
      code={404}
      message="Page not found"
      {...props}
    />
  );
}

function PrivateRoute({ ...params }) {
  if (params.vault.empty) {
    return <Redirect to="/register" />;
  }
  if (params.vault.sealed) {
    return (
      <Redirect
        to={{
          pathname: '/login',
          state: { referrer: params.location }
        }}
      />
    );
  }
  return (
    <Route {...params} />
  );
}

function SwitchNetwork({ ...params }) {
  const { url } = params.match.params;
  if (!!params.testnet !== !!config.testnet) {
    params.switchAction(params.testnet);
    chrome.storage.local.remove('router', () => {
      window.location.hash = `#${url || '/'}`;
      window.location.reload();
    });
    return <div />;
  }
  return <Redirect to={url} />;
}

class Rooting extends Component {
  static propTypes = {
    vault: PropTypes.object.isRequired,
    queue: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired,
    authDialog: PropTypes.object.isRequired,
  };

  componentWillUnmount() {

  }

  render() {
    const { vault, queue, actions, authDialog } = this.props;

    return (
      <div className={style.app}>
        <Switch>
          <Route
            exact
            path="/testnet:url(.*)"
            render={props =>
              <SwitchNetwork testnet switchAction={actions.switchNetwork} {...props} />
            }
          />
          <Route
            exact
            path="/mainnet:url(.*)"
            render={props =>
              <SwitchNetwork switchAction={actions.switchNetwork} {...props} />
            }
          />
          <Route
            exact
            path="/restore"
            render={props =>
              <RestorePage restoreAction={actions.create} {...props} />
            }
          />
          {!vault.empty ? <Route
            exact
            path="/login"
            render={props =>
              <LoginPage vault={vault} loginAction={actions.unseal} {...props} />
            }
          /> : ''}
          {vault.empty ? <Route
            exact
            path="/register/:step([a-z]+)?"
            render={props =>
              <RegisterPage registerAction={actions.create} {...props} />
            }
          /> : ''}
          <PrivateRoute
            exact
            path="/(popup.html)?"
            vault={vault}
            component={HomePage}
          />
          <PrivateRoute
            exact
            path="/settings"
            vault={vault}
            component={SettingsPage}
          />
          <PrivateRoute
            exact
            path="/settings/changePassword"
            vault={vault}
            component={PasswordChangePage}
          />
          <PrivateRoute
            exact
            path="/settings/accounts/import"
            vault={vault}
            render={props =>
              <AccountEditorPage
                vault={vault}
                saveAction={actions.addAccountInit}
                {...props}
              />
            }
          />
          <PrivateRoute
            exact
            path="/settings/accounts/:address([0-9A-F-]+)/edit"
            vault={vault}
            render={props =>
              <AccountEditorPage
                vault={vault}
                saveAction={actions.updateAccountInit}
                {...props}
              />
            }
          />
          <PrivateRoute
            exact
            path="/settings/accounts/:address([0-9A-F-]+)/keys"
            vault={vault}
            render={props =>
              <DetailsPage
                keys={vault.keys}
                accounts={vault.accounts} type="account"
                authConfirmed={authDialog.authConfirmed}
                {...props}
              />
            }
          />
          <PrivateRoute
            exact
            path="/settings/seedPhrase"
            vault={vault}
            component={SeedPhrasePage}
          />
          <PrivateRoute
            exact
            path="/settings/keys"
            vault={vault}
            component={KeysSettingsPage}
          />
          <PrivateRoute
            exact
            path="/settings/keys/:publicKey([0-9a-fA-F]{64})/"
            vault={vault}
            component={KeyDetailsPage}
          />
          <PrivateRoute
            exact
            path="/settings/keys/import"
            vault={vault}
            render={props =>
              <KeysImporterPage vault={vault} {...props} />
            }
          />
          <PrivateRoute
            exact
            path="/transactions/pending"
            vault={vault}
            render={props =>
              <PendingTransactionsPage vault={vault} queue={queue} {...props} />
            }
          />
          <PrivateRoute
            exact
            path="/transactions/:source(.+)/:id(.+)/:action(sign|popup-sign)"
            vault={vault}
            render={props =>
              <SignPage vault={vault} queue={queue} {...props} />
            }
          />
          <PrivateRoute
            exact
            path="/transactions/send-one"
            vault={vault}
            render={props =>
              <SendOnePage vault={vault} {...props} />
            }
          />
          <Route path="/" component={NotFoundErrorPage} />
        </Switch>
      </div>
    );
  }
}

export default connect(
  //FIXME remove fallbacks
  state => ({
    router: state.router || {},
    vault: state.vault || {},
    queue: state.queue || [],
    authDialog: state.authDialog,
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        ...vaultActions,
        ...formActions,
        ...settingsActions,
        ...commonActions,
      }, dispatch)
  })
)(Rooting);
