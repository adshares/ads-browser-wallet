import React from 'react';
import PropTypes from 'prop-types';

import style from './Card.css';

export default class Card extends React.Component {
  render() {
    const {
      bgImg,
      children,
      ...rest
    } = this.props;

    const styleClassName = classNames.join(' ');

    return (
      <div className={styleClassName} {...rest}>
        <div>{children}</div>
      </div>
    );
  }
}

Card.propTypes = {
  image: PropTypes.any,
  className: PropTypes.string,
  children: PropTypes.any,
};

