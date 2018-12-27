import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import Form from '../../components/atoms/Form';
import style from './confirmDialog.css';
import Button from '../atoms/Button';
import FormControl from '../atoms/FormControl';

const ConfirmDialog = ({ showDialog, password, handlePasswordChange, onSubmit }) => (
  <div className={`${style.dialog} ${showDialog && style.dialogOpen}`}>
    <Form
      className={`${style.dialogForm} ${showDialog &&
        style.dialogFormOpen}`}
    >
      <h2>
        <FontAwesomeIcon icon={faLock} className={style.dialogHeaderIcon} />
          Please authenticate yourself
        </h2>
      <FormControl
        isInput
        required
        label="password"
        type="password"
        value={password.value}
        handleChange={handlePasswordChange}
        className={style.inputPassword}
        errorMessage={password.errorMsg}
      />
      <Button
        type="button"
        layout="info"
        onClick={onSubmit}
      >
          Confirm
        </Button>
    </Form>
  </div>
  );

export default ConfirmDialog;

ConfirmDialog.propTypes = {
  showDialog: PropTypes.bool,
  password: PropTypes.object,
  handlePasswordChange: PropTypes.func,
  onSubmit: PropTypes.func
};
