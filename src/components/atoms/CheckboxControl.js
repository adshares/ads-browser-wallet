import React from 'react';
import PropTypes from 'prop-types';
import style from './CheckboxControl.module.css';

const CheckboxControl = ({ name, checked, label, handleChange, readOnly = false }) => {
  const handleChanges = (e) => {
    if (e.keyCode && e.keyCode !== 13) return;
    handleChange(e.target.checked, e.target.name);
  };

  return (
    <div className={style.checkboxWrapper}>
      <input
        name={name}
        tabIndex="0"
        className={`${style.checkbox} ${style.checkboxChecked}`}
        type="checkbox"
        id={label}
        checked={checked}
        onChange={handleChanges}
        disabled={readOnly}
      />
      <span className={style.checked}>
        <svg viewBox={[0, 0, 50, 50].join()} className={style.checkedSvg}>
          <path d="M5 30 L 20 45 L 45 5" />
        </svg>
      </span>
      <label htmlFor={label} className={style.label}>{label}</label>
    </div>
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
