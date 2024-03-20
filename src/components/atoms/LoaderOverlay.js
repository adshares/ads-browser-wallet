import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import style from './LoaderOverlay.module.css';

const LoaderOverlay = () => (
  <div className={style.loader}>
    <FontAwesomeIcon
      className={style.spinner}
      icon={faSpinner}
      title="loading"
    />
  </div>
);

export default LoaderOverlay;
