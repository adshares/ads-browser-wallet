import React from 'react';
import PropTypes from 'prop-types';

import style from './IconsStyles.css';

export default function Broadcast({
  width = 18,
  height = 18,
  className = style.dark }) {
  return (<svg width={width} height={height} viewBox="0 0 24 14" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M3.5 0.5H0.5V3.5C2.16 3.5 3.5 2.16 3.5 0.5ZM11.5 0.5H9.5C9.5 5.47 5.47 9.5 0.5 9.5V11.5C6.58 11.5 11.5 6.57 11.5 0.5ZM7.5 0.5H5.5C5.5 3.26 3.26 5.5 0.5 5.5V7.5C4.37 7.5 7.5 4.37 7.5 0.5ZM7.5 18.5H9.5C9.5 13.53 13.53 9.5 18.5 9.5V7.5C12.43 7.5 7.5 12.43 7.5 18.5ZM15.5 18.5H18.5V15.5C16.84 15.5 15.5 16.84 15.5 18.5ZM11.5 18.5H13.5C13.5 15.74 15.74 13.5 18.5 13.5V11.5C14.63 11.5 11.5 14.63 11.5 18.5Z" />
  </svg>);
}

Broadcast.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  className: PropTypes.string
};
