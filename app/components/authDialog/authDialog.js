import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';
import Form from '../../components/atoms/Form';
import style from './authDialog.css';
import Button from '../atoms/Button';
import InputControl from '../atoms/InputControl';
import PageComponent from '../PageComponent';

export default class AuthDialog extends PageComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    errorMsg: PropTypes.string,
    isOpened: PropTypes.bool,
    closeAction: PropTypes.func,
    confirmAction: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      password: ''
    };
  }

  cleanForm() {
    this.setState({
      password: ''
    });
  }

  handlePasswordChange = (value) => {
    this.setState({
      password: value
    });
  }

  handleCancelClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (this.props.closeAction) {
      this.props.closeAction(this.props.name);
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (this.props.confirmAction) {
      this.props.confirmAction(this.props.name, this.state.password);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isOpened && !this.props.isOpened) {
      this.cleanForm();
    }
  }

  render() {
    const classes = [];
    classes.push(style.dialog);
    const formClasses = [];
    formClasses.push(style.dialogForm);

    if (this.props.isOpened) {
      classes.push(style.dialogOpen);
      formClasses.push(style.dialogFormOpen);
    }

    return (
      <div className={classes.join(' ')}>
        <Form
          className={formClasses.join(' ')}
          onSubmit={this.handleSubmit}
        >
          <h2>
            <FontAwesomeIcon icon={faLock} className={style.dialogHeaderIcon} />
            Please authenticate yourself
          </h2>
          <InputControl
            isInput
            label="password"
            type="password"
            name="password"
            value={this.state.password}
            handleChange={this.handlePasswordChange}
            className={style.inputPassword}
            errorMessage={this.props.errorMsg}
            autoFocus
          />
          <div className={style.buttonsContainer}>
            <Button
              type="reset"
              layout="info"
              inverse
              icon="left"
              onClick={this.handleCancelClick}
            >
              <FontAwesomeIcon icon={faTimes} /> Cancel
            </Button>
            <Button
              type="submit"
              layout="info"
              icon="right"
            >
              Confirm <FontAwesomeIcon icon={faCheck} />
            </Button>
          </div>
        </Form>
      </div>
    );
  }
}
