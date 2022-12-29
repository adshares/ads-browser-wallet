import React from 'react';
import PropTypes from 'prop-types';
import style from './Box.css';

export default class Box extends React.Component {
  render() {
    const {
      layout,
      title,
      // icon,
      inverse,
      className,
      children,
      ...rest
    } = this.props;

    const classNames = [];
    classNames.push(style.box);
    if (title) {
      classNames.push(style.large);
    }
    if (layout) {
      classNames.push(style[layout]);
    }
    if (inverse) {
      classNames.push(style.inverse);
    }
    // if (icon) {
    //   classNames.push(style.hasIcon);
    // }
    if (className) {
      classNames.push(className);
    }
    const styleClassName = classNames.join(' ');

    return (
      <div className={styleClassName} {...rest}>
        {/*{icon ? <div className={style.icon}>*/}
        {/*  <span>{icon}</span>*/}
        {/*</div> : ''}*/}
        <div className={style.content}>{children}</div>
      </div>
    );
  }
}

Box.propTypes = {
  layout: PropTypes.string,
  title: PropTypes.string,
  icon: PropTypes.any,
  inverse: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.any,
};
