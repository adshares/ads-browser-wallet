import React from 'react';
import style from './Header.css';
import Logo from '../Logo/Logo';
import Select from '../Select/Select';
import HamburgerMenu from '../HamburgerMenu/HamburgerMenu';

export default class Header extends React.Component {
  render() {
    return (
      <header className={style.header} >
        <Logo className={style.headerLogo} />
        <Select options={['0003:000011CC:0001', '0003:000011CC:001']} />
        <HamburgerMenu />
      </header>
    );
  }
}
