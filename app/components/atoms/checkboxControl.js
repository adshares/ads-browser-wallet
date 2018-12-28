import React from 'react';
import PropTypes from 'prop-types';
import style from './CheckboxControl.css';

const CheckboxControl = ({ name, checked, label, handleChange }) => {
  const handleChanges = (e) => {
    if (e.keyCode && e.keyCode !== 13) return;
    handleChange(e.target.checked, e.target.name);
  };

  return (
    <div className={style.checkboxWrapper}>
      <input
        name={name}
        tabIndex="0"
        className={`${style.checkbox} ${ style.checkboxChecked}`}
        type="checkbox"
        id={label}
        checked={checked}
        onChange={handleChanges}
      />
      <label htmlFor={label} className={style.checked}>
        <svg viewBox={[0, 0, 50, 50].join()} className={style.checkedSvg}>
          <path d="M5 30 L 20 45 L 45 5" />
        </svg>
      </label>
      <span className={style.label}>{label}</span>
    </div>
  );
};

export default CheckboxControl;

CheckboxControl.propTypes = {
  name: PropTypes.string,
  checked: PropTypes.bool,
  label: PropTypes.string.isRequired,
  handleChange: PropTypes.func,
};
