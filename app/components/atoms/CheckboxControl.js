import React from 'react';
import PropTypes from 'prop-types';
import style from './CheckboxControl.css';

const CheckboxControl = ({ name, checked, label, handleChange, readOnly = false }) => {
  const handleChanges = (e) => {
    if (e.keyCode && e.keyCode !== 13) return;
    handleChange(e.target.checked, e.target.name);
  };

  return (
    <label className={style.container} htmlFor={label} >
      <input
        name={name}
        tabIndex="0"
        className={`${style.checkbox}`}
        // className={`${style.checkbox} ${style.checked}`}
        type="checkbox"
        id={label}
        checked={checked}
        onChange={handleChanges}
        disabled={readOnly}
      />
      {label}
      {/*<span className={style.checked}>*/}
      {/*  <svg width="18" height="18" viewBox="0 0 17 12" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
      {/*    <path d="M2 4.60188L7.41667 10.2393L15.3333 2"
      stroke="white" strokeWidth="2" strokeLinecap="square" />*/}
      {/*  </svg>*/}
      {/*</span>*/}
    </label>
  );
};

export default CheckboxControl;

CheckboxControl.propTypes = {
  name: PropTypes.string,
  checked: PropTypes.bool,
  readOnly: PropTypes.bool,
  label: PropTypes.string.isRequired,
  handleChange: PropTypes.func,
};
