import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ErrorPage from './ErrorPage';
import HomePage from './HomePage';
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
    <div>
      <Header />
      <section className={style.app}>
        <Switch>
          <Route
            exact
            path="/(popup.html)?"
            component={HomePage}
          />
          <Route
            exact
            path="/restore"
            component={ErrorPage}
          />
          <Route
            exact
            path="/register/:step([0-9]+)?"
            component={ErrorPage}
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
      </section>
      <Footer />
    </div>
  );
}
