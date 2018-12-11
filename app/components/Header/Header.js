import React from 'react';
import style from './Header.css';
import logo from '../../assets/logo_blue.svg';
import SelectAccount from '../SelectAccount/SelectAccount';
import HamburgerMenu from '../HamburgerMenu/HamburgerMenu';

const TEST_ACCOUNTS = [
  {
    name: 'Test 1',
    account: '0003:000011BB:0001'
  }, {
    name: 'Test 2',
    account: '0013:000011CD:0002'
  }, {
    name: 'Test 3',
    account: '0003:000012BB:0001'
  },
];


export default class Header extends React.Component {
  render() {
    return (
      <header className={style.header}>
        <img src={logo} alt="Adshares wallet" className={style.headerLogo} />
        <SelectAccount options={TEST_ACCOUNTS} />
        <HamburgerMenu />
      </header>
    );
  }
}
