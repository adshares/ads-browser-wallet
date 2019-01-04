import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';
import Form from '../../components/atoms/Form';
import style from './authDialog.css';
import Button from '../atoms/Button';
import InputControl from '../atoms/InputControl';
import FormComponent from '../FormComponent';

export default class AuthDialog extends FormComponent {

  static propTypes = {
    uuid: PropTypes.string.isRequired,
    errorMsg: PropTypes.string,
    closeAction: PropTypes.func,
    confirmAction: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      password: '',
      isSubmitted: false,
    };
  }

  handleCancelClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (this.props.closeAction) {
      this.props.closeAction(this.props.uuid);
    }
  }

  handleConfirmClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.setState({
      isSubmitted: true
    });
    if (this.props.confirmAction) {
      this.props.confirmAction(this.props.uuid, this.state.password);
    }
  }

  render() {
    return (
      <div className={`${style.dialog} ${style.dialogOpen}`}>
        <Form
          className={`${style.dialogForm} ${style.dialogFormOpen}`}
        >
          <h2>
            <FontAwesomeIcon icon={faLock} className={style.dialogHeaderIcon} />
            Please authenticate yourself {this.props.uuid}
          </h2>
          <InputControl
            isInput
            required
            label="password"
            type="password"
            value={this.state.password}
            handleChange={this.handlePasswordChange}
            className={style.inputPassword}
            errorMessage={this.props.errorMsg}
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
              disabled={this.state.isSubmitted}
            >
              Confirm <FontAwesomeIcon icon={faCheck} />
            </Button>
          </div>
        </Form>
      </div>
    );
  }
}
