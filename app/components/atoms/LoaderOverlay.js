import React from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import style from './LoaderOverlay.css';

const LoaderOverlay = () => (
  <div className={style.loader}>
    {/*<FontAwesomeIcon*/}
    {/*  className={style.spinner}*/}
    {/*  icon={faSpinner}*/}
    {/*  title="loading"*/}
    {/*/>*/}
    <svg
      className="spinner" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 70 70" stroke="#FF414D"
      fill="none" title="loading"
    >
      <circle className="spinnerOuterCircle" cx="35" cy="35" r="30" strokeWidth="3" />
      <circle className="spinnerInnerCircle" cx="35" cy="35" r="22" strokeWidth="3" />
      <circle className="spinnerMiddle" cx="35" cy="35" r="11" fill="#FF414D" />
    </svg>
  </div>
);

export default LoaderOverlay;
