import React from 'react';
import PropTypes from 'prop-types';

import style from './IconsStyles.css';

export default function Wrap({
  width = 18,
  height = 18,
  className = style.dark }) {
  return (<svg width={width} height={height} viewBox="0 0 24 14" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M6.59 5.67L1.41 0.5L0 1.91L5.17 7.08L6.59 5.67ZM10.5 0.5L12.54 2.54L0 15.09L1.41 16.5L13.96 3.96L16 6V0.5H10.5ZM10.83 9.91L9.42 11.32L12.55 14.45L10.5 16.5H16V11L13.96 13.04L10.83 9.91Z" fill="black"/>
  </svg>);
}

Wrap.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  className: PropTypes.string
};
