import React from 'react';
import PropTypes from 'prop-types';
import ErrorPage from '../containers/ErrorPage';

export default class PageComponent extends React.PureComponent {
  getReferrer(defaultLocation = '/') {
    if (this.props.history.location && this.props.history.location.state) {
      return this.props.history.location.state.referrer || defaultLocation;
    }
    return defaultLocation;
  }

  renderErrorPage(code, message, cancelLink, onCancelClick) {
    return (
      <ErrorPage
        code={code}
        message={message}
        cancelLink={cancelLink || this.getReferrer()}
        onCancelClick={onCancelClick}
      />
    );
  }

  renderNotFoundErrorPage(name, id, cancelLink, onCancelClick) {
    return (
      <ErrorPage
        code={404}
        message={`Cannot find ${name} '${id}'`}
        cancelLink={cancelLink || this.getReferrer()}
        onCancelClick={onCancelClick}
      />
    );
  }
}

PageComponent.propTypes = {
  history: PropTypes.object.isRequired,
};
