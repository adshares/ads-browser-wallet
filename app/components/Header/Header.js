import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Link from 'react-router-dom/es/Link';
import style from './Header.css';
import logo from '../../assets/logo_blue.svg';
import SelectAccount from '../SelectAccount/SelectAccount';
import HamburgerMenu from '../HamburgerMenu/HamburgerMenu';
import * as VaultActions from '../../actions/vault';

@connect(
  state => ({
    vault: state.vault,
  }),
  dispatch => ({
    actions: bindActionCreators(VaultActions, dispatch)
  })
)
export default class Header extends React.PureComponent {
  render() {
    const { vault, actions } = this.props;
    return (
      <header className={style.header}>
        <Link to="/">
          <img src={logo} alt="Adshares wallet" className={style.headerLogo} />
        </Link>
        <SelectAccount options={vault.accounts} />
        <HamburgerMenu logoutAction={actions.seal} />
      </header>
    );
  }
}

Header.propTypes = {
  vault: PropTypes.object,
  actions: PropTypes.object,
};

