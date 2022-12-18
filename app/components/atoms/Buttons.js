import React from 'react';
import PropTypes from 'prop-types';
import style from './Buttons.css';

export default class Buttons extends React.Component {
  render() {
    const {
      children
    } = this.props;
    return (
      <div className={style.buttons}>
        {children}
      </div>
    );
  }
}

Buttons.propTypes = {
  children: PropTypes.any,
};
