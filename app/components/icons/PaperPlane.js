import React from 'react';
import PropTypes from 'prop-types';

import style from './IconsStyles.css';

export default function PaperPlane({
  width = 18,
  height = 18,
  className = 'light' }) {
  return (<svg width={width} height={height} viewBox="0 0 24 20" className={`style.${className}`} xmlns="http://www.w3.org/2000/svg">
    <path d="M2.51 3.53L10.02 6.75L2.5 5.75L2.51 3.53ZM10.01 12.25L2.5 15.47V13.25L10.01 12.25ZM0.51 0.5L0.5 7.5L15.5 9.5L0.5 11.5L0.51 18.5L21.5 9.5L0.51 0.5Z" />
  </svg>);
}

PaperPlane.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  className: PropTypes.string
};
