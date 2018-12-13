import React from 'react';
import PropTypes from 'prop-types';

export default class FormComponent extends React.PureComponent {

  getReferrer(defaultLocation = '/') {
    if (this.props.location && this.props.location.state) {
      return this.props.location.state.referrer || defaultLocation;
    }
    return defaultLocation;
  }

  handleInputChange = (event, callback) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    }, callback);
  };

  handlePasswordChange = (event) => {
    this.handleInputChange(event, () => {
      document.querySelector('[name=password]').setCustomValidity('');
    });
  };
}

FormComponent.propTypes = {
  location: PropTypes.object.isRequired,
};
