import React from 'react';
import PropTypes from 'prop-types';

import style from './IconsStyles.css';

export default function Expand({
  width = 18,
  height = 18,
  className = style.dark }) {
  return (<svg width={width} height={height} viewBox="0 0 24 14" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M2 9H0V14H5V12H2V9ZM0 5H2V2H5V0H0V5ZM12 12H9V14H14V9H12V12ZM9 0V2H12V5H14V0H9Z" />
  </svg>);
}

Expand.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  className: PropTypes.string
};
