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
import AccountEditorPage from './Settings/AccountEditorPage';
import KeysImporterPage from './Settings/KeysImporterPage';
import AwaitingTransactionsPage from './Transactions/AwaitingTransactionsPage';
import SignPage from './Transactions/SignPage';
import style from './App.css';
import * as VaultActions from '../actions/vault';
import AccountKeysPage from './Settings/AccountKeysPage';

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
  params.switchAction(params.testnet);
  chrome.storage.local.remove('router', () => {
    window.location.hash = `#${url || '/'}`;
    window.location.reload();
  });
  return <div />;
}

@connect(
  //FIXME remove fallbacks
  state => ({
    router: state.router || {},
    vault: state.vault || {},
    queue: state.queue || [],
  }),
  dispatch => ({
    actions: bindActionCreators(VaultActions, dispatch)
  })
)
export default class Rooting extends Component {

  static propTypes = {
    router: PropTypes.object.isRequired,
    vault: PropTypes.object.isRequired,
    queue: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
  };

  componentWillUnmount() {

  }

  render() {
    const { router, vault, queue, actions } = this.props;
    console.debug(router.location.pathname);

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
              <LoginPage loginAction={actions.unseal} {...props} />
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
              <SettingsPage vault={vault} actions={actions} {...props} />
            }
          />
          <PrivateRoute
            exact
            path="/accounts/import"
            vault={vault}
            render={props =>
              <AccountEditorPage vault={vault} saveAction={actions.addAccount} {...props} />
            }
          />
          <PrivateRoute
            exact
            path="/accounts/:address([0-9A-F-]+)/edit"
            vault={vault}
            render={props =>
              <AccountEditorPage vault={vault} saveAction={actions.updateAccount} {...props} />
            }
          />
          <PrivateRoute
            exact
            path="/accounts/:address([0-9A-F-]+)/keys"
            vault={vault}
            render={props =>
              <AccountKeysPage vault={vault} {...props} />
            }
          />
          <PrivateRoute
            exact
            path="/keys/import"
            vault={vault}
            render={props =>
              <KeysImporterPage vault={vault} saveAction={actions.importKey} {...props} />
            }
          />
          <PrivateRoute
            exact
            path="/transactions/awaiting"
            vault={vault}
            render={props =>
              <AwaitingTransactionsPage vault={vault} queue={queue} {...props} />
            }
          />
          <PrivateRoute
            exact
            path="/transactions/:source(.+)/:id(.+)/sign"
            vault={vault}
            render={props =>
              <SignPage vault={vault} queue={queue} {...props} />
            }
          />
          <Route path="/" component={NotFoundErrorPage} />
        </Switch>
      </div>
    );
  }
}
