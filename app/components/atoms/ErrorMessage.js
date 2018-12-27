import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';
import style from './ErrorMessage.css';

const ErrorMessage = ({ errorMessage }) => (
  <div className={style.errorBox}>
    <FontAwesomeIcon icon={faExclamation} />
    <span className={style.errorMessage} >{errorMessage} </span>
  </div>
);


export default ErrorMessage;

ErrorMessage.propTypes = {
  errorMessage: PropTypes.string,
};
