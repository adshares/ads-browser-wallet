import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';
import Form from '../../components/atoms/Form';
import style from './confirmDialog.css';
import Button from '../atoms/Button';
import InputControl from '../atoms/InputControl';
import ButtonLink from '../atoms/ButtonLink';
import PageComponent from '../PageComponent';

class ConfirmDialog extends PageComponent {
  render() {
    const { showDialog, password, handlePasswordChange, onSubmit, cancelLink } = this.props;
    return (
      <div className={`${style.dialog} ${showDialog && style.dialogOpen}`}>
        <Form
          className={`${style.dialogForm} ${showDialog &&
          style.dialogFormOpen}`}
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
            value={password.value}
            handleChange={handlePasswordChange}
            className={style.inputPassword}
            errorMessage={password.errorMsg}
          />
          <div className={style.buttonsContainer}>
            <ButtonLink
              layout="info"
              inverse
              icon="left"
              to={cancelLink}
            >
              <FontAwesomeIcon icon={faTimes} /> Cancel
            </ButtonLink>
            <Button
              type="button"
              layout="info"
              icon="right"
              onClick={onSubmit}
            >
              Confirm <FontAwesomeIcon icon={faCheck} />
            </Button>
          </div>

        </Form>
      </div>
    );
  }
};

export default ConfirmDialog;

ConfirmDialog.propTypes = {
  showDialog: PropTypes.bool,
  password: PropTypes.object,
  handlePasswordChange: PropTypes.func,
  onSubmit: PropTypes.func,
  cancelLink: PropTypes.any.isRequired,
};
