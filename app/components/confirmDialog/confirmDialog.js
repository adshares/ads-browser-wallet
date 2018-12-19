import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import Form from "../../components/atoms/Form";
import style from "./confirmDialog.css";
import Button from "../atoms/Button";
import VaultCrypt from "../../utils/vaultcrypt";

export default class ConfirmDialog extends React.Component {
  constructor(props) {
    super(props);
    this.passwordInput = React.createRef();
  }
  handleSubmit = () => {
    this.props.onSubmit();
  };

  render() {
    const { showDialog } = this.props;

    return (
      <div className={`${style.dialog} ${showDialog && style.dialogOpen}`}>
        <Form
          onSubmit={this.handleSubmit}
          className={`${style.dialogForm} ${showDialog &&
            style.dialogFormOpen}`}
        >
          <h2>
            <FontAwesomeIcon icon={faLock} className={style.dialogHeaderIcon} />
            Please authenticate yourself
          </h2>
          <input
            required
            type="password"
            placeholder="password"
            value={this.props.passwordValue}
            onChange={this.props.onChange}
            className={style.inputPassword}
            ref={this.passwordInput}
          />
          <Button
            type="button"
            layout="info"
            onClick={() => this.handleSubmit()}
          >
            {" "}
            Confirm{" "}
          </Button>
        </Form>
      </div>
    );
  }
}
// export default ConfirmDialog;

ConfirmDialog.propTypes = {
  onAuthenticated: PropTypes.func,
  showDialog: PropTypes.bool,
  vault: PropTypes.object
};
