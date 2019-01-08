import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import style from './Button.css';

export default class ButtonLink extends React.Component {
  render() {
    const {
      className,
      children,
      layout,
      size,
      inverse,
      icon,
      external,
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

    if (disabled) {
      return (
        <span className={styleClassName} {...rest}>
          {children}
        </span>
      );
    }
    if (external) {
      return (
        <a className={styleClassName} {...rest}>
          {children}
        </a>
      );
    }
    return (
      <Link className={styleClassName} {...rest}>
        {children}
      </Link>
    );
  }
}

ButtonLink.propTypes = {
  className: PropTypes.string,
  children: PropTypes.any,
  layout: PropTypes.string,
  size: PropTypes.string,
  inverse: PropTypes.bool,
  icon: PropTypes.string,
  external: PropTypes.bool,
  disabled: PropTypes.bool,
};
