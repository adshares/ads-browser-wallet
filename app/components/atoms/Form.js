import React from 'react';
import PropTypes from 'prop-types';
import style from './Form.css';

export default class Form extends React.Component {
  render() {
    return (
      <form
        className={`${style.form} ${this.props.className}`}
        onSubmit={this.props.action}
      >
        {this.props.children}
      </form>
    );
  }
}

Form.propTypes = {
  children: PropTypes.any,
  className: PropTypes.strig,
  action: PropTypes.func,
};
