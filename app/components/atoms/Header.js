import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { TimesIcon } from '../icons/Icons';
import HamburgerMenu from '../HamburgerMenu/HamburgerMenu';
import logo from '../../assets/logomark.svg';
import config from '../../config/config';
import style from './Header.css';

export default class Header extends React.Component {
  static propTypes = {
    logoutAction: PropTypes.any,
    cancelLink: PropTypes.any,
    onCancelClick: PropTypes.func,
    noLinks: PropTypes.bool,
    title: PropTypes.string
  };

  render() {
    const {
      logoutAction,
      cancelLink,
      onCancelClick,
      noLinks,
      title
    } = this.props;

    let menu;
    if (noLinks) {
      menu = <div />;
    } else if (cancelLink) {
      menu = (
        <Link
          to={cancelLink}
          onClick={onCancelClick}
          className={style.close}
        >
          <TimesIcon />
        </Link>
      );
    } else {
      menu = <HamburgerMenu logoutAction={logoutAction} />;
    }

    return (
      <header className={style.header}>
        <Link to="/" className={style.logo}>
          <img src={logo} alt="Adshares wallet" />
          {config.testnet && <span>TESTNET</span>}
          {/*{config.testnet ? <span>TESTNET</span> : ''}*/}
        </Link>
        {title && <h1 className={style.title}>{title}</h1>}
        {menu}
      </header>
    );
  }
}

