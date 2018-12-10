import React from 'react';
import style from './Form.css';

const Form = () => {
  const { className, children, ...rest } = { ...this.props };
  return (
    <form
      className={`${style.form} ${className || ''}`}
      {...rest}
    >
      {children}
    </form>
  );
};
export default Form;
