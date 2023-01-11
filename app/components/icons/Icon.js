import React from 'react';
import PropTypes from 'prop-types';
import style from './IconsStyles.css';

export default class Icon extends React.Component {
  render() {
    const {
      width = 18,
      height = 18,
      viewBox = '0 0 22 18',
      fill = 'dark',
      rotate,
      children
    } = this.props;

    const classNames = [];
    classNames.push(style[fill]);
    if (rotate) {
      classNames.push(style[rotate]);
    }
    const className = classNames.join('');

    return (
      <svg width={width} height={height} viewBox={viewBox} className={className} xmlns="http://www.w3.org/2000/svg">
        {children}
      </svg>
    );
  }
}

Icon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  viewBox: PropTypes.string,
  fill: PropTypes.string,
  rotate: PropTypes.any,
  children: PropTypes.any
};