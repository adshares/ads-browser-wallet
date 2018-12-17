import React from 'react';
import PropTypes from 'prop-types';
import style from './FromControl.css';


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
  const validate = () => {

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
          onChange={handleChange}
        />) : (
          <textarea
            id={`${label}`}
            required={required}
            autoFocus={autoFocus}
            readOnly={readOnly}
            pattern={pattern}
            value={value}
            maxLength={maxLength}
            className={style.input}
            onChange={handleChange}
          />
      )}
      <label
        htmlFor={`${label}`}
        className={style.label}
      >{label} </label>
      {!isValid && (
        <div>
          {errorMessage}
        </div>)}
    </div>);
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
  type: PropTypes.string,
};
