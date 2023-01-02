import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faExpand,
  faCog,
  faInfoCircle,
  faSignOutAlt,
  faToggleOn, faServer, faMoneyBill,
} from '@fortawesome/free-solid-svg-icons';
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
                  <FontAwesomeIcon icon={faExpand} />
                  <span className={style.menuItemLink}>Fullscreen</span>
                </span>
              </li>
            }
            {config.testnet ?
              <Link to={'/mainnet'} className={style.menuItem}>
                <FontAwesomeIcon icon={faExpand} />
                <span className={style.menuItemLink}>Switch to the mainnet</span>
              </Link> :
              <Link to={'/testnet'} className={style.menuItem}>
                <FontAwesomeIcon icon={faServer} />
                <span className={style.menuItemLink}>Switch to the testnet</span>
              </Link>
            }
            <li>
              <Link to="/settings" className={style.menuItem}>
                <FontAwesomeIcon icon={faCog} />
                <span className={style.menuItemLink}>Settings</span>
              </Link>
            </li>
            <li>
              <Link to="/transactions" className={style.menuItem}>
                <FontAwesomeIcon icon={faMoneyBill} />
                <span className={style.menuItemLink}>Transactions</span>
              </Link>
            </li>
            <li>
              <Link to="/about" className={style.menuItem}>
                <FontAwesomeIcon icon={faInfoCircle} />
                <span className={style.menuItemLink}>About</span>
              </Link>
            </li>
            <li>
              <a href="/logout" className={style.menuItem} onClick={this.handleLogout}>
                <FontAwesomeIcon icon={faToggleOn} />
                <span className={style.menuItemLink}>Switch to dark mode</span>
              </a>
            </li>
            <li>
              <a href="/logout" className={style.menuItem} onClick={this.handleLogout}>
                <FontAwesomeIcon icon={faSignOutAlt} />
                <span className={style.menuItemLink}>Log out</span>
              </a>
            </li>
          </ul>
        </div>
      </React.Fragment>
    );
  }
}
