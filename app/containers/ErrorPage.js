import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default class ErrorPage extends React.PureComponent {

  render() {
    const code = this.props.code || 100;
    const message = this.props.message || 'Unknown Error';

    return (
      <div>
        <h1 title={`Error ${code}`}>
          {message}
        </h1>
        {this.props.children}
        <Link to={'/'}>Home page</Link>
      </div>
    );
  }
}

ErrorPage.propTypes = {
  message: PropTypes.string,
  code: PropTypes.number,
  children: PropTypes.object,
};
