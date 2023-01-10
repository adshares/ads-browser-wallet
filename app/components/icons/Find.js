import React from 'react';
import PropTypes from 'prop-types';

import style from './IconsStyles.css';

export default function Find({
  width = 18,
  height = 18,
  className = style.dark }) {
  return (<svg width={width} height={height} viewBox="0 0 24 14" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M12.5 11.5H11.71L11.43 11.23C12.41 10.09 13 8.61 13 7C13 3.41 10.09 0.5 6.5 0.5C2.91 0.5 0 3.41 0 7C0 10.59 2.91 13.5 6.5 13.5C8.11 13.5 9.59 12.91 10.73 11.93L11 12.21V13L16 17.99L17.49 16.5L12.5 11.5ZM6.5 11.5C4.01 11.5 2 9.49 2 7C2 4.51 4.01 2.5 6.5 2.5C8.99 2.5 11 4.51 11 7C11 9.49 8.99 11.5 6.5 11.5Z" />
  </svg>);
}

Find.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  className: PropTypes.string
};
