import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import style from './LoaderOverlay.css';

const LoaderOverlay = () => (
  <div className={style.loader}>
    <FontAwesomeIcon
      className={style.spinner}
      icon="spinner"
      title="loading"
    />
  </div>
);

export default LoaderOverlay;
