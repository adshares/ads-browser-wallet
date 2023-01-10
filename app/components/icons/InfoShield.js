import React from 'react';
import PropTypes from 'prop-types';

import style from './IconsStyles.css';

export default function InfoShield({
  width = 18,
  height = 18,
  className = style.dark }) {
  return (<svg width={width} height={height} viewBox="0 0 24 14" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M9 2.69L16 5.8V10.5C16 15.02 13.02 19.19 9 20.43C4.98 19.19 2 15.02 2 10.5V5.8L9 2.69ZM9 0.5L0 4.5V10.5C0 16.05 3.84 21.24 9 22.5C14.16 21.24 18 16.05 18 10.5V4.5L9 0.5ZM8 6.5H10V8.5H8V6.5ZM8 10.5H10V16.5H8V10.5Z" />
  </svg>);
}

InfoShield.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  className: PropTypes.string
};
