import React from 'react';
import PropTypes from 'prop-types';
import ErrorPage from '../containers/ErrorPage';

export default class PageComponent extends React.PureComponent {

  getReferrer(defaultLocation = '/') {
    if (this.props.location && this.props.location.state) {
      return this.props.location.state.referrer || defaultLocation;
    }
    return defaultLocation;
  }

  renderErrorPage(code, message, cancelLink) {
    return (
      <ErrorPage
        code={code}
        message={message}
        cancelLink={cancelLink || this.getReferrer()}
      />
    );
  }
}

PageComponent.propTypes = {
  location: PropTypes.object.isRequired,
};
