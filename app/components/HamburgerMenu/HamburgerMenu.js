import React from 'react';
import PropTypes from 'prop-types';
import Link from 'react-router-dom/es/Link';
import config from '../../config/config';
import style from './HamburgerMenu.css';
import PageComponent from '../PageComponent';
import { openInTheNewTab } from '../../utils/utils';

export default class HamburgerMenu extends PageComponent {
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
      <div
        className={style.hamburgerWrapper}
      >
        <div
          tabIndex="0"
          role="button"
          className={`${style.iconButton} ${this.state.menuOpened && style.iconButtonActive}`}
          onClick={() => this.toggleMenu(!this.state.menuOpened)}
          onBlur={() => (this.blurTimeout = setTimeout(() => { this.toggleMenu(false); }, 200))}
          // onFocus={() => this.toggleMenu(true)}
        />
        <ul
          className={`${style.menu} ${this.state.menuOpened && style.menuActive}`}
          // onMouseLeave={() => this.toggleMenu(false)}
        >
          <li>
            <Link to="/settings" className={style.menuItem}>Settings</Link>
          </li>
          <li>
            <Link to="/keys/import" className={style.menuItem}>Import private key</Link>
          </li>
          <li>
            <a href="/logout" className={style.menuItem} onClick={this.handleLogout}>Log out</a>
          </li>
          {showFullScreen &&
          <li>
            <span role={'button'} onClick={() => openInTheNewTab('window.html#/')} className={style.menuItem}>
              Open in a window
            </span>
          </li>
          }
          <li>
            <hr />
            {config.testnet ?
              <Link to={'/mainnet'} className={style.menuItem}>Switch to the mainnet</Link> :
              <Link to={'/testnet'} className={style.menuItem}>Switch to the testnet</Link>
            }
          </li>
        </ul>
      </div>
    );
  }
}

HamburgerMenu.propTypes = {
  logoutAction: PropTypes.func.isRequired,
};
