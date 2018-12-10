import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import style from './Header.css';
import Logo from '../Logo/Logo';
import Select from '../Select/Select';

export default class Header extends React.Component {
  render() {
    return (
      <header className={style.header} >
        <Select options={['publisher', 'advertiser']} />
        <Logo className={style.headerLogo} />
        <button className={style.iconButton}>
          <FontAwesomeIcon icon={faBars} />
        </button>
      </header>
    );
  }
}
