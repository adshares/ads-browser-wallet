import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Link from 'react-router-dom/es/Link';
import ButtonLink from '../atoms/ButtonLink';
import SelectAccount from '../SelectAccount/SelectAccount';
import HamburgerMenu from '../HamburgerMenu/HamburgerMenu';
import * as VaultActions from '../../actions/vault';
import logo from '../../assets/logo_blue.svg';
import style from './Page.css';

@connect(
  state => ({
    vault: state.vault,
  }),
  dispatch => ({
    actions: bindActionCreators(VaultActions, dispatch)
  })
)
export default class Page extends React.Component {
  render() {
    const {
      vault,
      actions,
      title,
      cancelLink,
      scroll,
      smallTitle,
      children,
      ...rest
    } = this.props;

    let classes = [];
    classes.push(style.header);
    if (smallTitle) {
      classes.push(style.smallHeader);
    }
    const headerClass = classes.join(' ');

    classes = [];
    classes.push(style.contentWrapper);
    if (scroll) {
      classes.push(style.withScroll);
    }
    const wrapperClass = classes.join(' ');

    return (
      <section {...rest}>
        <header className={headerClass}>
          <Link to="/">
            <img src={logo} alt="Adshares wallet" className={style.logo} />
          </Link>
          {title ? <h1>{title}</h1> : <SelectAccount options={vault.accounts} />}
          {cancelLink ? <ButtonLink to={cancelLink} className={style.close} size="small" inverse>
            <FontAwesomeIcon icon={faTimes} />
          </ButtonLink> : <HamburgerMenu logoutAction={actions.seal} /> }
        </header>
        <div className={wrapperClass}>
          {children}
        </div>
      </section>
    );
  }
}

Page.propTypes = {
  children: PropTypes.any,
  vault: PropTypes.object,
  actions: PropTypes.object,
  title: PropTypes.string,
  cancelLink: PropTypes.any,
  smallTitle: PropTypes.bool,
  scroll: PropTypes.bool,
};
