import React from 'react';
import style from './Box.css';

export default class Box extends React.Component {
  render() {
    const {
      type,
      title,
      className,
      children,
      ...rest
    } = { ...this.props };

    const classNames = [];
    classNames.push(style.box);
    if (title) {
      classNames.push(style.large);
    }
    if (type) {
      classNames.push(style[type]);
    }
    if (className) {
      classNames.push(className);
    }
    const styleClassName = classNames.join(' ');

    return (
      <div className={styleClassName} {...rest}>
        {title ? <h2>{title}</h2> : ''}
        <p>{children}</p>
      </div>
    );
  }
}
