import React from 'react';
import PropTypes from 'prop-types';
import { ExpandIcon, RecycleIcon, SettingsIcon, TransactionsIcon, InfoCircleIcon, SwitchIcon, LogOutIcon } from '../icons/Icons';
import { Link } from 'react-router-dom';
import config from '../../config/config';
import style from './HamburgerMenu.css';
import PageComponent from '../PageComponent';
import { openInTheNewTab } from '../../utils/utils';

export default class HamburgerMenu extends PageComponent {
  static propTypes = {
    logoutAction: PropTypes.func.isRequired,
  };

  state = {
    menuOpened: false,
  };

  handleLogout = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.props.logoutAction();
  };

  componentWillUnmount() {
    clearTimeout(this.blurTimeout);
  }

  toggleMenu(status) {
    this.setState({
      menuOpened: status
    });
  }

  render() {
    const showFullScreen = !window.location.pathname.match('window');

    return (
      <React.Fragment>
        <div className={style.hamburgerWrapper}>
          <div
            tabIndex="0"
            role="button"
            className={`${style.iconButton} ${this.state.menuOpened && style.iconButtonActive}`}
            onClick={() => this.toggleMenu(!this.state.menuOpened)}
            onBlur={() => (this.blurTimeout = setTimeout(() => { this.toggleMenu(false); }, 200))}
          />
        </div>
        <div className={`${style.menu} ${this.state.menuOpened && style.menuActive}`}>
          <ul>
            {showFullScreen &&
              <li>
                <span role="button" onClick={() => openInTheNewTab('window.html#/')} className={style.menuItem}>
                  <ExpandIcon />
                  <span className={style.menuItemLink}>Fullscreen</span>
                </span>
              </li>
            }
            {config.testnet ?
              <Link to={'/mainnet'} className={style.menuItem}>
                <ExpandIcon />
                <span className={style.menuItemLink}>Switch to the mainnet</span>
              </Link> :
              <Link to={'/testnet'} className={style.menuItem}>
                <RecycleIcon />
                <span className={style.menuItemLink}>Switch to the testnet</span>
              </Link>
            }
            <li>
              <Link to="/settings" className={style.menuItem}>
                <SettingsIcon />
                <span className={style.menuItemLink}>Settings</span>
              </Link>
            </li>
            <li>
              <Link to="/transactions" className={style.menuItem}>
                <TransactionsIcon />
                <span className={style.menuItemLink}>Transactions</span>
              </Link>
            </li>
            <li>
              <Link to="/about" className={style.menuItem}>
                <InfoCircleIcon />
                <span className={style.menuItemLink}>About</span>
              </Link>
            </li>
            <li>
              <a href="/logout" className={style.menuItem} onClick={this.handleLogout}>
                <SwitchIcon />
                <span className={style.menuItemLink}>Switch to dark mode</span>
              </a>
            </li>
            <li>
              <a href="/logout" className={style.menuItem} onClick={this.handleLogout}>
                <LogOutIcon />
                <span className={style.menuItemLink}>Log out</span>
              </a>
            </li>
          </ul>
        </div>
      </React.Fragment>
    );
  }
}
