import React from 'react';
import { Switch, Route } from 'react-router-dom';
import ErrorPage from './ErrorPage';
import HomePage from './HomePage';
import RestorePage from './RestorePage';
import RegisterPage from './RegisterPage';
import LoginPage from './LoginPage';
import style from './App.css';

function NotFoundErrorPage(props) {
  return (
    <ErrorPage
      code={404}
      message="Page not found"
      {...props}
    />
  );
}

export default function App() {
  return (
    <div className={style.app}>
      <Switch>
        <Route
          exact
          path="/(popup.html)?"
          component={HomePage}
        />
        <Route
          exact
          path="/restore"
          component={RestorePage}
        />
        <Route
          exact
          path="/register/:step([a-z]+)?"
          component={RegisterPage}
        />
        <Route
          exact
          path="/login"
          component={LoginPage}
        />
        <Route
          exact
          path="/settings"
          component={LoginPage}
        />
        <Route
          exact
          path="/sign"
          component={LoginPage}
        />
        <Route component={NotFoundErrorPage} />
      </Switch>
    </div>
  );
}
