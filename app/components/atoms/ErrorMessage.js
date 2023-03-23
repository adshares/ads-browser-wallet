import React from 'react';
import PropTypes from 'prop-types';

import style from './ErrorMessage.css';

const ErrorMessage = ({ errorMessage }) => (
  <div className={style.errorBox}>
    <span className={style.errorIcon} >!</span>
    <span className={style.errorMessage} >{errorMessage} </span>
  </div>
);


export default ErrorMessage;

ErrorMessage.propTypes = {
  errorMessage: PropTypes.string,
};
