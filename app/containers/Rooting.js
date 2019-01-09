import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import ErrorPage from './ErrorPage';
import HomePage from './Home/HomePage';
import RestorePage from './Account/RestorePage';
import RegisterPage from './Account/RegisterPage';
import LoginPage from './Account/LoginPage';
import SettingsPage from './Settings/SettingsPage';
import PasswordChangePage from './Settings/PasswordEditorPage';
import AccountEditorPage from './Settings/AccountEditorPage';
import KeyEditorPage from './Settings/KeyEditorPage';
import SendOnePage from './Transactions/SendOnePage';
import PendingTransactionsPage from './Transactions/PendingTransactionsPage';
import SignPage from './Transactions/SignPage';
import SeedPhrasePage from './Settings/SeedPhrasePage';
import KeysSettingsPage from './Settings/KeysSettingsPage';
import KeyDetailsPage from './Settings/KeyDetailsPage';
import * as vaultActions from '../actions/vaultActions';
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
    chrome.storage.local.set({
      [config.routerStorageKey]: JSON.stringify({
        action: 'REPLACE',
        location: { pathname: url || '/', hash: '', search: '' }
      })
    }, () => {
      window.location.reload();
    });
    return <FontAwesomeIcon icon={faSpinner} className="window-spinner" />;
  }

  return <Redirect to={url} />;
}

class Rooting extends Component {
  static propTypes = {
    router: PropTypes.object.isRequired,
    vault: PropTypes.object.isRequired,
    queue: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired,
  };

  render() {
    const { router, vault, queue, actions } = this.props;

    return (
      <div className={style.app}>
        <Switch router={router}>
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
          <Route
            exact
            path="/login"
            render={props =>
              <LoginPage vault={vault} loginAction={actions.unseal} {...props} />
            }
          />
          <Route
            exact
            path="/register/:step([a-z]+)?"
            render={props =>
              <RegisterPage registerAction={actions.create} {...props} />
            }
          />
          <PrivateRoute
            path="/(popup.html)?"
            exact vault={vault} component={HomePage}
          />
          <PrivateRoute
            path="/settings"
            exact vault={vault} component={SettingsPage}
          />
          <PrivateRoute
            path="/settings/changePassword"
            exact vault={vault} component={PasswordChangePage}
          />
          <PrivateRoute
            path="/settings/accounts/import"
            exact vault={vault} component={AccountEditorPage}
          />
          <PrivateRoute
            path="/settings/accounts/:address([0-9A-F-]+)/edit"
            exact vault={vault} component={AccountEditorPage}
          />
          <PrivateRoute
            path="/settings/seedPhrase"
            exact vault={vault} component={SeedPhrasePage}
          />
          <PrivateRoute
            path="/settings/keys"
            exact vault={vault} component={KeysSettingsPage}
          />
          <PrivateRoute
            path="/settings/keys/:publicKey([0-9a-fA-F]{64})/"
            exact vault={vault} component={KeyDetailsPage}
          />
          <PrivateRoute
            path="/settings/keys/import"
            exact vault={vault} component={KeyEditorPage}
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

export default withRouter(connect(
  //FIXME remove fallbacks
  state => ({
    router: state.router || {},
    vault: state.vault || {},
    queue: state.queue || [],
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        ...vaultActions
      }, dispatch)
  })
)(Rooting));
