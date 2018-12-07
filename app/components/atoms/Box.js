import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import style from './Box.css';

export default class Box extends React.Component {
  render() {
    const {
      type,
      title,
      icon,
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
    if (icon) {
      classNames.push(style.hasIcon);
    }
    if (className) {
      classNames.push(className);
    }
    const styleClassName = classNames.join(' ');

    return (
      <div className={styleClassName} {...rest}>
        {icon ? <div className={style.icon}>
          <FontAwesomeIcon icon={icon} />
        </div> : ''}
        {title ? <h2>{title}</h2> : ''}
        <p>{children}</p>
      </div>
    );
  }
}
