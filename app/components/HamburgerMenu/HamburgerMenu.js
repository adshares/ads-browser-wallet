import React from 'react';
import PropTypes from 'prop-types';
import Link from 'react-router-dom/es/Link';
import style from './HamburgerMenu.css';

export default class HamburgerMenu extends React.PureComponent {
  state = {
    menuOpened: false,
  };

  toggleMenu(status) {
    this.setState({
      menuOpened: status
    });
  }

  render() {
    return (
      <div
        className={style.hamburgerWrapper}
        onMouseEnter={() => this.toggleMenu(true)}
      >
        <div
          tabIndex="0"
          role="button"
          className={`${style.iconButton} ${this.state.menuOpened && style.iconButtonActive}`}
          onClick={() => this.toggleMenu(!this.state.menuOpened)}
          onFocus={() => this.toggleMenu(true)}
        />
        <ul
          className={`${style.menu} ${this.state.menuOpened && style.menuActive}`}
          onMouseLeave={() => this.toggleMenu(false)}
        >
          <li>
            <Link to="/settings" className={style.menuItem} >  Settings </Link>
          </li>
          <li>
            <Link to={'/'} className={style.menuItem} onClick={this.props.ereaseAction} >Erase storage</Link>
          </li>
          <li>
            <Link to="/accounts/import" className={style.menuItem}> Add account </Link>
          </li>
          <li>
            <Link
              to={'/'} onClick={this.props.logoutAction} className={style.menuItem}
              onBlur={() => this.toggleMenu(false)}
            >
              Logout</Link>
          </li>
        </ul>
      </div>
    );
  }
}

HamburgerMenu.propTypes = {
  logoutAction: PropTypes.func.isRequired,
  ereaseAction: PropTypes.func.isRequired,
};
