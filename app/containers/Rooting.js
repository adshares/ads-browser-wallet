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
import PasswordChangePage from './Settings/PasswordChangePage';
import AccountEditorPage from './Settings/AccountEditorPage';
import KeysImporterPage from './Settings/KeysImporterPage';
import SendOnePage from './Transactions/SendOnePage';
import PendingTransactionsPage from './Transactions/PendingTransactionsPage';
import SignPage from './Transactions/SignPage';
import style from './App.css';
import * as vaultActions from '../actions/vaultActions';
import * as formActions from '../actions/form';
import * as settingsActions from '../actions/settingsActions';
import * as commonActions from '../actions/actions';
import config from '../config/config';
import DetailsPage from './Settings/DetailsPage';
import KeysSettings from './Settings/KeysSettings';
import ConfirmDialog from '../components/confirmDialog/confirmDialog';

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
    return <Redirect to="/register"/>;
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
    return <div/>;
  }
  return <Redirect to={url}/>;
}

@connect(
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
)
export default class Rooting extends Component {

  static propTypes = {
    vault: PropTypes.object.isRequired,
    queue: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired,
  };

  componentWillUnmount() {

  }

  render() {
    const { vault, queue, router, actions, authDialog } = this.props;

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
            render={
              props => <HomePage vault={vault} queue={queue} {...props} />
            }
          />
          <PrivateRoute
            exact
            path="/settings"
            vault={vault}
            render={props =>
              <SettingsPage
                vault={vault}
                actions={actions}
                {...props}
              />
            }
          />
          <PrivateRoute
            exact
            path="/password"
            vault={vault}
            render={props =>
              <PasswordChangePage vault={vault} {...props} />
            }
          />
          <PrivateRoute
            exact
            path="/accounts/import"
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
            path="/accounts/:address([0-9A-F-]+)/edit"
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
            path="/accounts/:address([0-9A-F-]+)/keys"
            vault={vault}
            render={props =>
              <DetailsPage
                accounts={vault.accounts} type="account"
                toggleAuthDialog={actions.toggleGlobalAuthorisationDialog}
                previewSecretData={actions.previewSecretDataInit}
                authConfirmed={authDialog.authConfirmed}
                {...props}
              />
            }
          />

          <PrivateRoute
            exact
            path="/seedPhrase"
            vault={vault}
            render={props =>
              <DetailsPage
                seed={vault.seedPhrase}
                type="seed"
                toggleAuthDialog={actions.toggleGlobalAuthorisationDialog}
                previewSecretData={actions.previewSecretDataInit}
                authConfirmed={authDialog.authConfirmed}
                {...props}
              />
            }
          />

          <PrivateRoute
            exact
            path="/keys"
            vault={vault}
            render={props =>
              <KeysSettings
                keys={vault.keys}
                seed={vault.seed}
                removeKeyAction={actions.removeKeyInit}
                toggleAuthDialog={actions.toggleGlobalAuthorisationDialog}
                showKeys={actions.previewSecretDataInit}
                saveGeneratedKeysAction={actions.saveGeneratedKeysInit} {...props}
              />
            }
          />
          <PrivateRoute
            exact
            path="/keys/:pk([0-9a-fA-F]{64})/"
            vault={vault}
            render={props =>
              <DetailsPage
                keys={vault.keys}
                type="key"
                toggleAuthDialog={actions.toggleGlobalAuthorisationDialog}
                previewSecretData={actions.previewSecretDataInit}
                authConfirmed={authDialog.authConfirmed}
                {...props}
              />
            }
          />
          <PrivateRoute
            exact
            path="/keys/import"
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
        {authDialog.authModalOpen && (
          <ConfirmDialog
            showDialog
            cancelLink={router.location.state ?
              router.location.state.referrer.pathname :
              router.location.pathname}
            handlePasswordChange={actions.handleGlobalPassInputChange}
            onSubmit={actions.globalPassInputValidate}
            password={authDialog.password}
          />
        )}
      </div>
    );
  }
}
