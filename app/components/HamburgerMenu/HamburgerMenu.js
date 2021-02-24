import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faExpandArrowsAlt,
  faCog,
  faInfoCircle,
  faSignOutAlt,
  faToggleOn,
  faToggleOff,
  faHashtag,
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
      <div className={style.hamburgerWrapper}>
        <div
          tabIndex="0"
          role="button"
          className={`${style.iconButton} ${this.state.menuOpened && style.iconButtonActive}`}
          onClick={() => this.toggleMenu(!this.state.menuOpened)}
          onBlur={() => (this.blurTimeout = setTimeout(() => { this.toggleMenu(false); }, 200))}
        />
        <ul className={`${style.menu} ${this.state.menuOpened && style.menuActive}`}>
          {showFullScreen &&
            <li>
              <span role="button" onClick={() => openInTheNewTab('window.html#/')} className={style.menuItem}>
                <FontAwesomeIcon icon={faExpandArrowsAlt} /> Expand view
              </span>
            </li>
          }
          {config.testnet ?
            <Link to={'/mainnet'} className={style.menuItem}>
              <FontAwesomeIcon icon={faToggleOff} /> Switch to the mainnet
            </Link> :
            <Link to={'/testnet'} className={style.menuItem}>
              <FontAwesomeIcon icon={faToggleOn} /> Switch to the testnet
            </Link>
          }
          <hr />
          <li>
            <Link to="/settings" className={style.menuItem}>
              <FontAwesomeIcon icon={faCog} /> Settings
            </Link>
          </li>
          <li>
            <Link to="/transactions" className={style.menuItem}>
              <FontAwesomeIcon icon={faHashtag} /> Transactions
            </Link>
          </li>
          <li>
            <Link to="/about" className={style.menuItem}>
              <FontAwesomeIcon icon={faInfoCircle} /> About
            </Link>
          </li>
          <li>
            <a href="/logout" className={style.menuItem} onClick={this.handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} /> Log out
            </a>
          </li>
        </ul>
      </div>
    );
  }
}
