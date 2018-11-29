import React from 'react';
import PropTypes from 'prop-types';
import style from './Button.css';

export default class Button extends React.Component {
  render() {
    return (
      <button
        className={`${style.button} ${this.props.className}`}
        type={this.props.type}
        onClick={this.props.action}
      >
        {this.props.children}
      </button>
    );
  }
}

Button.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  type: PropTypes.string,
  action: PropTypes.func,
};
