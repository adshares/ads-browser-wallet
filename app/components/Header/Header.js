import React from 'react';
import PropTypes from 'prop-types';
import Link from 'react-router-dom/es/Link';
import style from './Header.css';
import logo from '../../assets/logo_blue.svg';
import SelectAccount from '../SelectAccount/SelectAccount';
import HamburgerMenu from '../HamburgerMenu/HamburgerMenu';

export default class Header extends React.PureComponent {
  render() {
    const { logoutAction, accounts } = this.props;
    return (
      <header className={style.header}>
        <Link to="/">
          <img src={logo} alt="Adshares wallet" className={style.headerLogo} />
        </Link>
        <HamburgerMenu logoutAction={logoutAction} />
      </header>
    );
  }
}

Header.propTypes = {
  accounts: PropTypes.array.isRequired,
  logoutAction: PropTypes.func.isRequired,
};

