import React from 'react';
import PropTypes from 'prop-types';
import style from './InputControl.css';
import ErrorMessage from './ErrorMessage';

const InputControl = ({
  name,
  value,
  label,
  required,
  readOnly,
  pattern,
  autoFocus,
  isValid,
  errorMessage,
  maxLength,
  isInput,
  handleChange,
  rows,
  type,
  children,
}) => {
  const handleInputChange = (e) => {
    handleChange(e.target.value, e.target.name);
  };

  const classes = [];
  classes.push(style.inputWrapper);
  if (isValid === false) {
    classes.push(style.invalid);
  }

  return (
    <div className={classes.join(' ')}>
      {isInput ? (
        <input
          type={type}
          id={`${label}`}
          name={name}
          type={type}
          required={required}
          readOnly={readOnly}
          value={value}
          autoFocus={autoFocus}
          maxLength={maxLength}
          className={style.input}
          onChange={handleInputChange}
        />
      ) : (
        <textarea
          id={`${label}`}
          name={name}
          required={required}
          autoFocus={autoFocus}
          readOnly={readOnly}
          pattern={pattern}
          value={value}
          maxLength={maxLength}
          className={style.input}
          rows={rows}
          onChange={handleInputChange}
        />
      )}
      <label htmlFor={`${label}`} className={style.label}>
        {label}
      </label>
      {children}
      {!isValid && !!errorMessage && <ErrorMessage errorMessage={errorMessage} />}
    </div>
  );
};

export default InputControl;

InputControl.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  label: PropTypes.string.isRequired,
  required: PropTypes.bool,
  readOnly: PropTypes.bool,
  isInput: PropTypes.bool,
  pattern: PropTypes.string,
  autoFocus: PropTypes.bool,
  errorMessage: PropTypes.string,
  isValid: PropTypes.bool,
  maxLength: PropTypes.number,
  handleChange: PropTypes.func,
  rows: PropTypes.number,
  type: PropTypes.string,
  children: PropTypes.any,
};
