import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamation, faTimes } from '@fortawesome/free-solid-svg-icons';
import ButtonLink from '../atoms/ButtonLink';
import SelectAccount from '../SelectAccount/SelectAccount';
import HamburgerMenu from '../HamburgerMenu/HamburgerMenu';
import AuthDialog from '../authDialog/authDialog';
import LoaderOverlay from '../atoms/LoaderOverlay';
import Timer from '../Timer/Timer';
import * as VaultActions from '../../actions/vaultActions';
import * as FormActions from '../../actions/formActions';
import * as AuthDialogActions from '../../actions/authDialogActions';
import logo from '../../assets/img/logo_blue.svg';
import config from '../../config/config';
import style from './Page.module.css';
import Box from '../atoms/Box';

class Page extends React.Component {
  static propTypes = {
    children: PropTypes.any,
    className: PropTypes.string,
    vault: PropTypes.object,
    actions: PropTypes.object,
    title: PropTypes.string,
    subTitle: PropTypes.string,
    cancelLink: PropTypes.any,
    onCancelClick: PropTypes.func,
    noLinks: PropTypes.bool,
    homeLink: PropTypes.bool,
    smallTitle: PropTypes.bool,
    scroll: PropTypes.bool,
    showLoader: PropTypes.bool,
    authDialog: PropTypes.object,
    errorMsg: PropTypes.string,
  };

  render() {
    const {
      vault,
      actions,
      title,
      subTitle,
      cancelLink,
      onCancelClick,
      noLinks,
      homeLink,
      scroll,
      smallTitle,
      children,
      className,
      showLoader,
      authDialog,
      errorMsg,
    } = this.props;

    let classes = [];
    classes.push(style.header);
    if (smallTitle) {
      classes.push(style.smallHeader);
    }
    const headerClass = classes.join(' ');

    classes = [];
    classes.push(style.contentWrapper);
    if (className) {
      classes.push(className);
    }
    if (scroll) {
      classes.push(style.withScroll);
    }
    const wrapperClass = classes.join(' ');
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
      menu = <HamburgerMenu logoutAction={actions.vault.seal} />;
    }
    return (
      <section>
        {showLoader && <LoaderOverlay />}
        <AuthDialog
          {...authDialog}
          closeAction={actions.authDialog.closeDialog}
          confirmAction={actions.authDialog.confirmPassword}
        />
        <header className={headerClass}>
          <div className={style.logo}>
            {noLinks || homeLink === false ? (
              <img src={logo} alt="Adshares wallet" />
            ) : (
              <Link to="/">
                <img src={logo} alt="Adshares wallet" />
              </Link>
            )}
            {config.testnet ? <span>TESTNET</span> : ''}
          </div>
          {title ? (
            <h1>
              {title} {subTitle && subTitle !== title ? <small>{subTitle}</small> : ''}
            </h1>
          ) : (
            <SelectAccount
              options={vault.accounts} selectedAccount={vault.selectedAccount}
              selectAccount={actions.vault.selectActiveAccount}
            />
          )}
          {menu}
        </header>
        <div className={wrapperClass}>
          {errorMsg && <Box title="Server error" layout="warning" icon={faExclamation} className={style.errorClass}>
            {errorMsg}
          </Box>}
          {children}
        </div>
        <footer className={style.footer}>
          <Timer />
        </footer>
      </section>
    );
  }
}

export default withRouter(connect(
  state => ({
    vault: state.vault,
    pages: state.pages,
    authDialog: state.authDialog,
  }),
  dispatch => ({
    actions: {
      vault: bindActionCreators(VaultActions, dispatch),
      form: bindActionCreators(FormActions, dispatch),
      authDialog: bindActionCreators(AuthDialogActions, dispatch),
    }
  })
)(Page));
