import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import Form from '../../components/atoms/Form';
import style from './confirmDialog.css';
import Button from '../atoms/Button';
import VaultCrypt from '../../utils/vaultcrypt';
import { InvalidPasswordError } from '../../actions/errors';

export class ConfirmDialog extends React.Component{
  constructor(props) {
    super(props);
    this.passwordInput = React.createRef();

  }
  handleSubmit = () => {
    console.log('this.passwordInput.current.value', this.passwordInput.current.value)
    if (!VaultCrypt.checkPassword(this.props.vault, this.passwordInput.current.value)) {
      console.log('invalid');
      this.passwordInput.current.setCustomValidity('Invalid password');
      // throw new InvalidPasswordError();
    }
  };
  render() {
    const { showDialog } = this.props;
    console.log('showDialog', showDialog);

    return (<div className={`${style.dialog} ${showDialog && style.dialogOpen}`}>
      <Form onSubmit={this.handleSubmit} className={`${style.dialogForm} ${showDialog && style.dialogFormOpen}`}>
        <h2>
          <FontAwesomeIcon icon={faLock} className={style.dialogHeaderIcon} />
          Please authenticate yourself
        </h2>
        <input required type="password" placeholder="password" className={style.inputPassword} ref={this.passwordInput}/>
        <Button type="button" onClick={e => this.handleSubmit()}> Confirm </Button>
      </Form>
    </div>
    );
  }

}

export default ConfirmDialog;

ConfirmDialog.propTypes = {
  showDialog: PropTypes.bool,
  vault: PropTypes.object,
};
