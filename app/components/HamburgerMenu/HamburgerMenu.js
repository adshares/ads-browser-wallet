import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import style from './HamburgerMenu.css';

export default class HamburgerMenu extends React.PureComponent {
  render() {
    return (
      <div className={style.header} >
        <button className={style.iconButton}>
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>
    );
  }
}
