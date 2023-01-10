import React from 'react';
import PropTypes from 'prop-types';

import style from './IconsStyles.css';

export default function Switch({
  width = 18,
  height = 18,
  className = style.dark }) {
  return (<svg width={width} height={height} viewBox="0 0 24 14" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M16 0H6C2.69 0 0 2.69 0 6C0 9.31 2.69 12 6 12H16C19.31 12 22 9.31 22 6C22 2.69 19.31 0 16 0ZM16 10H6C3.79 10 2 8.21 2 6C2 3.79 3.79 2 6 2H16C18.21 2 20 3.79 20 6C20 8.21 18.21 10 16 10ZM16 3C14.34 3 13 4.34 13 6C13 7.66 14.34 9 16 9C17.66 9 19 7.66 19 6C19 4.34 17.66 3 16 3Z" />
  </svg>);
}

Switch.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  className: PropTypes.string
};
