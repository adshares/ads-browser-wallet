import React from 'react';
import PropTypes from 'prop-types';
import style from './Button.css';

export default class Button extends React.Component {
  render() {
    const {
      className,
      children,
      layout,
      size,
      inverse,
      icon,
      disabled,
      ...rest
    } = this.props;

    const classNames = [];
    classNames.push(style.button);
    if (layout) {
      classNames.push(style[layout]);
    }
    if (size) {
      classNames.push(style[size]);
    }
    if (inverse) {
      classNames.push(style.inverse);
    }
    if (icon) {
      classNames.push(style[`icon-${icon}`]);
    }
    if (disabled) {
      classNames.push(style.disabled);
    }
    if (className) {
      classNames.push(className);
    }
    const styleClassName = classNames.join(' ');

    return (
      <button className={styleClassName} {...rest}>
        {children}
      </button>
    );
  }
}

Button.propTypes = {
  className: PropTypes.string,
  children: PropTypes.any,
  layout: PropTypes.string,
  size: PropTypes.string,
  inverse: PropTypes.bool,
  icon: PropTypes.string,
  disabled: PropTypes.bool,
};
