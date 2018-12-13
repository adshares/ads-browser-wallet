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

@connect(
  state => ({
    vault: state.vault,
    router: state.router,
  }),
  dispatch => ({
    actions: bindActionCreators(VaultActions, dispatch)
  })
)
export default class App extends Component {

  static propTypes = {
    vault: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  render() {
    const vault = this.props.vault;
    const actions = this.props.actions;
    console.debug(this.props.router.location.pathname);

    return (
      <div className={style.app}>
        <Switch>
          <Route
            exact
            path="/restore"
            render={props => <RestorePage restoreAction={actions.create} {...props} />}
          />
          {!vault.empty ? <Route
            exact
            path="/login"
            render={props => <LoginPage loginAction={actions.unseal} {...props} />}
          /> : ''}
          {vault.empty ? <Route
            exact
            path="/register/:step([a-z]+)?"
            render={props => <RegisterPage registerAction={actions.create} {...props} />}
          /> : ''}
          <PrivateRoute
            exact
            path="/(popup.html)?"
            vault={vault}
            render={props => <HomePage
              vault={vault}
              logoutAction={actions.seal}
              ereaseAction={actions.erease} {...props}
            />}
          />
          <PrivateRoute
            exact
            path="/(popup.html)?"
            vault={vault}
            render={props => <HomePage
              vault={vault}
              logoutAction={actions.seal}
              ereaseAction={actions.erease} {...props}
            />}
          />
          <PrivateRoute
            exact
            path="/settings"
            vault={vault}
            render={props => <SettingsPage
              vault={vault}
              actions={actions}
              ereaseAction={actions.erease}
              logoutAction={actions.seal}
              {...props}
            />}
          />
          <PrivateRoute
            exact
            path="/accounts/import"
            vault={vault}
            render={props => <AccountEditorPage
              vault={vault}
              ereaseAction={actions.erease}
              logoutAction={actions.seal}
              saveAction={actions.addAccount} {...props}
            />}
          />
          <PrivateRoute
            exact
            path="/accounts/:address([0-9A-F-]+)/edit"
            vault={vault}
            render={props => <AccountEditorPage
              vault={vault}
              ereaseAction={actions.erease}
              logoutAction={actions.seal}
              saveAction={actions.updateAccount} {...props}
            />}
          />
          <PrivateRoute
            exact
            path="/accounts/:address([0-9A-F-]+)/keys"
            vault={vault}
            render={props => <AccountKeysPage
              vault={vault}
              ereaseAction={actions.erease}
              logoutAction={actions.seal} {...props}
            />}
          />
          <PrivateRoute
            exact
            path="/keys/import"
            vault={vault}
            render={props => <KeysImporterPage
              ereaseAction={actions.erease}
              logoutAction={actions.seal}
              vault={vault}
              saveAction={actions.importKey} {...props}
            />}
          />
          <PrivateRoute
            exact
            path="/sign"
            vault={vault}
            render={props => <HomePage
              vault={vault} logoutAction={actions.seal}
              ereaseAction={actions.erease} {...props}
            />}
          />
          <Route path="/" component={NotFoundErrorPage} />
        </Switch>
      </div>
    );
  }
}
