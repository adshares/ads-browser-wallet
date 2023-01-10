import React from 'react';
import PropTypes from 'prop-types';

import style from './IconsStyles.css';

export default function Transactions({
  width = 18,
  height = 18,
  className = style.dark }) {
  return (<svg width={width} height={height} viewBox="0 0 24 14" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M7.01 9H0V11H7.01V14L11 10L7.01 6V9ZM12.99 8V5H20V3H12.99V0L9 4L12.99 8Z" />
  </svg>);
}

Transactions.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  className: PropTypes.string
};
