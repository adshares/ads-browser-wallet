import React from 'react';
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
          role="button"
          className={`${style.iconButton} ${this.state.menuOpened && style.iconButtonActive}`}
          onClick={() => this.toggleMenu(!this.state.menuOpened)}
        />
        <ul
          className={`${style.menu} ${this.state.menuOpened && style.menuActive}`}
          onMouseLeave={() => this.toggleMenu(false)}
        >
          <li className={style.menuItem}> Settings </li>
          <li className={style.menuItem}> Settings </li>
        </ul>
      </div>
    );
  }
}
