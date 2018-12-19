import React from 'react';
import PropTypes from 'prop-types';
import style from './checkbox.css';

export const Checkbox = ({ value, desc, handleChange }) => {
  const handleInputChange = () => {
    handleChange(!value);
  };

  return (
    <div className={style.checkboxWrapper}>
      <input
        className={style.checkbox}
        type="checkbox"
        id="check"
        onClick={handleInputChange}
      />
      <label htmlFor="check" className={style.checked}>
        <svg viewBox={[0, 0, 50, 50].join()} className={style.checkedSvg}>
          <path d="M5 30 L 20 45 L 45 5" />
        </svg>
      </label>
      <span className={style.desc}>{desc}</span>
    </div>
  );
};

export default Checkbox;

Checkbox.propTypes = {
  value: PropTypes.string,
  desc: PropTypes.string.isRequired,
  handleChange: PropTypes.func,
};
