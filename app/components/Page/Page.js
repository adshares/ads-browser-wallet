import React from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import Link from "react-router-dom/es/Link";
import ButtonLink from "../atoms/ButtonLink";
import SelectAccount from "../SelectAccount/SelectAccount";
import HamburgerMenu from "../HamburgerMenu/HamburgerMenu";
import ConfirmDialog from "../confirmDialog/confirmDialog";
import Timer from "../Timer/Timer";
import * as VaultActions from "../../actions/vault";
import * as FormActions from "../../actions/form";
import logo from "../../assets/logo_blue.svg";
import config from '../../config/config';
import style from "./Page.css";

@connect(
  state => ({
    vault: state.vault,
    pages: state.pages
  }),
  dispatch => ({
    actions: {
      vault: bindActionCreators(VaultActions, dispatch),
      form: bindActionCreators(FormActions, dispatch)
    }
  })
)
export default class Page extends React.Component {
  render() {
    const {
      vault,
      actions,
      title,
      subTitle,
      cancelLink,
      scroll,
      smallTitle,
      children,
      className,
      onPasswordInputChange,
      onDialogSubmit,
      passwordValue,
      autenticationModalOpen,
    } = this.props;

    let classes = [];
    classes.push(style.header);
    if (smallTitle) {
      classes.push(style.smallHeader);
    }
    const headerClass = classes.join(" ");

    classes = [];
    classes.push(style.contentWrapper);
    if (className) {
      classes.push(className);
    }
    if (scroll) {
      classes.push(style.withScroll);
    }
    const wrapperClass = classes.join(" ");

    return (
      <section>
        {autenticationModalOpen && (
          <ConfirmDialog
            showDialog
            onChange={onPasswordInputChange}
            onSubmit={onDialogSubmit}
            passwordValue={passwordValue}
          />
        )}
        <header className={headerClass}>
          <div className={style.logo}>
            <Link to="/">
              <img src={logo} alt="Adshares wallet" />
            </Link>
            {config.testnet ? <span>TESTNET</span> : ''}
          </div>
          {title ? (
            <h1>
              {title} {subTitle ? <small>{subTitle}</small> : ''}
            </h1>
          ) : (
            <SelectAccount options={vault.accounts} />
          )}
          {cancelLink ? (
            <ButtonLink
              to={cancelLink}
              className={style.close}
              size="small"
              inverse
            >
              <FontAwesomeIcon icon={faTimes} />
            </ButtonLink>
          ) : (
            <HamburgerMenu logoutAction={actions.vault.seal} />
          )}
        </header>
        <div className={wrapperClass}>{children}</div>
        <footer className={style.footer}>
          <Timer />
        </footer>
      </section>
    );
  }
}

Page.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  vault: PropTypes.object,
  actions: PropTypes.object,
  title: PropTypes.string,
  subTitle: PropTypes.string,
  cancelLink: PropTypes.any,
  smallTitle: PropTypes.bool,
  scroll: PropTypes.bool
};
