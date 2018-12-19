import React from 'react';
import PropTypes from 'prop-types';
import style from './FromControl.css';
import ErrorMessage from './ErrorMessage';

export const FormControl = ({
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
  type
}) => {
  const handleInputChange = (e) => {
    handleChange(e.target.value);
  };

  return (
    <div className={style.inputWrapper}>
      {isInput ? (
        <input
          id={`${label}`}
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
          required={required}
          autoFocus={autoFocus}
          readOnly={readOnly}
          pattern={pattern}
          value={value}
          maxLength={maxLength}
          className={style.input}
          onChange={handleInputChange}
        />
      )}
      <label htmlFor={`${label}`} className={style.label}>
        {label}
      </label>
      {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
    </div>
  );
};

export default FormControl;

FormControl.propTypes = {
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
  type: PropTypes.string
};
