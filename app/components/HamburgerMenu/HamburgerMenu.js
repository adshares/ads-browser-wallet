import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ExpandIcon, RecycleIcon, SettingsIcon, TransactionsIcon, InfoCircleIcon, SwitchIcon, LogOutIcon } from '../icons/Icons';
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

  toggleMode(status) {
    this.setState({
      darkMode: status
    });
    const root = document.querySelector(':root');
    root.toggleAttribute('data-dark-mode');
    if (!this.state.darkMode) {
      root.style.setProperty('--dark', '#fff');
      root.style.setProperty('--light', '#000');
    }
  }

  // toggleMode(status) {
  //   this.setState({
  //     darkMode: status
  //   });
  //   const root = document.querySelector(':root');
  //   const body = document.querySelector('body');
  //   body.dataset.darkMode = 'true';
  //   if (!this.state.darkMode) {
  //     root.style.setProperty('--dark', '#fff');
  //     root.style.setProperty('--light', '#000');
  //     root.style.setProperty('--light-rgb', '0,0,0');
  //     root.style.setProperty('--dark-rgb', '255,255,255');
  //   } else {
  //     root.style.setProperty('--light', '#fff');
  //     root.style.setProperty('--dark', '#000');
  //     root.style.setProperty('--dark-rgb', '0,0,0');
  //     root.style.setProperty('--light-rgb', '255,255,255');
  //   }
  // }

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
                  <ExpandIcon width={20} height={20} viewBox="0 0 20 16" />
                  <span className={style.menuItemLink}>Fullscreen</span>
                </span>
              </li>
            }
            {config.testnet ?
              <Link to={'/mainnet'} className={style.menuItem}>
                <RecycleIcon width={20} height={20} />
                <span className={style.menuItemLink}>Switch to the mainnet</span>
              </Link> :
              <Link to={'/testnet'} className={style.menuItem}>
                <RecycleIcon width={20} height={20} />
                <span className={style.menuItemLink}>Switch to the testnet</span>
              </Link>
            }
            <li>
              <Link to="/settings" className={style.menuItem}>
                <SettingsIcon width={20} height={26} viewBox="0 0 22 24" />
                <span className={style.menuItemLink}>Settings</span>
              </Link>
            </li>
            <li>
              <Link to="/transactions" className={style.menuItem}>
                <TransactionsIcon width={22} />
                <span className={style.menuItemLink}>Transactions</span>
              </Link>
            </li>
            <li>
              <Link to="/about" className={style.menuItem}>
                <InfoCircleIcon width={20} height={24} viewBox="0 0 22 22" />
                <span className={style.menuItemLink}>About</span>
              </Link>
            </li>
            <li>
              <span
                className={style.menuItem} onClick={() => this.toggleMode(!this.state.darkMode)}
              >
                <SwitchIcon width={22} height={16} viewBox="0 0 22 14" />
                {this.state.darkMode ?
                  <span className={style.menuItemLink}>Switch to light mode</span>
                  : <span className={style.menuItemLink}>Switch to dark mode</span>
                }
              </span>
            </li>
            <li>
              <a href="/logout" className={style.menuItem} onClick={this.handleLogout}>
                <LogOutIcon width={20} height={20} />
                <span className={style.menuItemLink}>Log out</span>
              </a>
            </li>
          </ul>
        </div>
      </React.Fragment>
    );
  }
}
