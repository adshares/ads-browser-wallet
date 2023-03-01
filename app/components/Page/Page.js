import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import SelectAccount from '../SelectAccount/SelectAccount';
import AuthDialog from '../authDialog/authDialog';
import LoaderOverlay from '../atoms/LoaderOverlay';
import Timer from '../Timer/Timer';
import * as VaultActions from '../../actions/vaultActions';
import * as FormActions from '../../actions/formActions';
import * as AuthDialogActions from '../../actions/authDialogActions';
import Header from '../atoms/Header';
import Box from '../atoms/Box';
import style from './Page.css';

class Page extends React.Component {
  static propTypes = {
    children: PropTypes.any,
    className: PropTypes.string,
    vault: PropTypes.object,
    actions: PropTypes.object,
    title: PropTypes.string,
    // subTitle: PropTypes.string,
    // cancelLink: PropTypes.any,
    // onCancelClick: PropTypes.func,
    // noLinks: PropTypes.bool,
    // homeLink: PropTypes.bool,
    // smallTitle: PropTypes.bool,
    // scroll: PropTypes.bool,
    showLoader: PropTypes.bool,
    authDialog: PropTypes.object,
    errorMsg: PropTypes.string,
    hideSelectAccount: PropTypes.any
  };

  render() {
    const {
      vault,
      actions,
      title,
      children,
      className,
      showLoader,
      authDialog,
      errorMsg,
      hideSelectAccount
    } = this.props;

    let classes = [];

    classes = [];
    classes.push(style.contentWrapper);
    if (className) {
      classes.push(className);
    }
    const wrapperClass = classes.join(' ');

    return (
      <div className={showLoader && style.hideScroll}>
        {showLoader && <LoaderOverlay />}
        <AuthDialog
          {...authDialog}
          closeAction={actions.authDialog.closeDialog}
          confirmAction={actions.authDialog.confirmPassword}
        />
        <Header logoutAction={actions.vault.seal} title={title} />
        {!hideSelectAccount && <SelectAccount
          options={vault.accounts} selectedAccount={vault.selectedAccount}
          selectAccount={actions.vault.selectActiveAccount}
        />}
        <div className={wrapperClass}>
          {errorMsg && <Box title="Server error" icon={'i'} layout="warning" className={style.errorClass}>
            {errorMsg}
          </Box>}
          {children}
        </div>
        <footer className={style.footer}>
          <Timer />
        </footer>
      </div>
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
