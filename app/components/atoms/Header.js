import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import HamburgerMenu from '../HamburgerMenu/HamburgerMenu';
import logo from '../../assets/logomark.svg';
import config from '../../config/config';
import style from './Header.css';
import ButtonLink from './ButtonLink';

export default class Header extends React.Component {
  static propTypes = {
    logoutAction: PropTypes.any,
    cancelLink: PropTypes.any,
    onCancelClick: PropTypes.func,
    noLinks: PropTypes.bool,
  };

  render() {
    const {
      logoutAction,
      cancelLink,
      onCancelClick,
      noLinks,
    } = this.props;


    let menu;
    if (noLinks) {
      menu = <div />;
    } else if (cancelLink) {
      menu = (
        <ButtonLink
          to={cancelLink}
          onClick={onCancelClick}
          className={style.close}
          size="small"
          inverse
        >
          <FontAwesomeIcon icon={faTimes} />
        </ButtonLink>
      );
    } else {
      menu = <HamburgerMenu logoutAction={logoutAction} />;
    }

    return (
      <header className={style.header}>
        <div className={style.logo}>
          <img src={logo} alt="Adshares wallet" />
          {config.testnet ? <span>TESTNET</span> : ''}
        </div>
        {menu}
      </header>
    );
  }
}

