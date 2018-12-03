import React from 'react';
import style from './Form.css';

export default class Form extends React.Component {
  render() {
    const { className, children, ...rest } = { ...this.props };
    return (
      <form
        className={`${style.form} ${className || ''}`}
        {...rest}
      >
        {children}
      </form>
    );
  }
}
