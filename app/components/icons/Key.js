import React from 'react';
import PropTypes from 'prop-types';

import style from './IconsStyles.css';

export default function Key({
  width = 18,
  height = 18,
  className = style.dark }) {
  return (<svg width={width} height={height} viewBox="0 0 24 14" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M22 14H16V10H13.32C12.18 12.42 9.72 14 7 14C3.14 14 0 10.86 0 7C0 3.14 3.14 0 7 0C9.72 0 12.17 1.58 13.32 4H24V10H22V14ZM18 12H20V8H22V6H11.94L11.71 5.33C11.01 3.34 9.11 2 7 2C4.24 2 2 4.24 2 7C2 9.76 4.24 12 7 12C9.11 12 11.01 10.66 11.71 8.67L11.94 8H18V12ZM7 10C5.35 10 4 8.65 4 7C4 5.35 5.35 4 7 4C8.65 4 10 5.35 10 7C10 8.65 8.65 10 7 10ZM7 6C6.45 6 6 6.45 6 7C6 7.55 6.45 8 7 8C7.55 8 8 7.55 8 7C8 6.45 7.55 6 7 6Z"/>
  </svg>);
}

Key.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  className: PropTypes.string
};
