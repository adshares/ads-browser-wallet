import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';
import Form from '../../components/atoms/Form';
import style from './authDialog.css';
import Button from '../atoms/Button';
import InputControl from '../atoms/InputControl';
import PageComponent from '../PageComponent';

class AuthDialog extends PageComponent {
  render() {
    const { handlePasswordChange, onSubmit, cancelLink } = this.props;
    return (
      <div className={`${style.dialog} ${style.dialogOpen}`}>
        <Form
          className={`${style.dialogForm} ${style.dialogFormOpen}`}
        >
          <h2>
            <FontAwesomeIcon icon={faLock} className={style.dialogHeaderIcon} />
            Please authenticate yourself
          </h2>
          <InputControl
            isInput
            required
            label="password"
            type="password"
            // value={password.value}
            handleChange={handlePasswordChange}
            className={style.inputPassword}
            // errorMessage={password.errorMsg}
          />
          <div className={style.buttonsContainer}>
            <Button
              layout="info"
              inverse
              icon="left"
              onClick={this.handleCancelClick}
            >
              <FontAwesomeIcon icon={faTimes} /> Cancel
            </Button>
            <Button
              type="button"
              layout="info"
              icon="right"
              onClick={this.handleConfirmClick}
            >
              Confirm <FontAwesomeIcon icon={faCheck} />
            </Button>
          </div>

        </Form>
      </div>
    );
  }
}

export default AuthDialog;

AuthDialog.propTypes = {
  // showDialog: PropTypes.bool,
  // password: PropTypes.object,
  // handlePasswordChange: PropTypes.func,
  // onSubmit: PropTypes.func,
  // cancelLink: PropTypes.any.isRequired,
};
