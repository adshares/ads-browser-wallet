import React from 'react';

export default class FormPage extends React.Component {
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
