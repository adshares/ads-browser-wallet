import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faTimes } from '@fortawesome/free-solid-svg-icons';
import Page from '../../components/Page/Page';
import PageComponent from '../../components/PageComponent';
import InputControl from '../../components/atoms/InputControl';
import Form from '../../components/atoms/Form';
import ButtonLink from '../../components/atoms/ButtonLink';
import Button from '../../components/atoms/Button';
import style from './SettingsPage.css';

class PasswordChangePage extends PageComponent {
  static PAGE_NAME = 'SettingsPage';

  handleInputChange = (inputName, inputValue) => {
    this.props.onChange(
      PasswordChangePage.PAGE_NAME,
      inputValue,
      inputName,
    );
  };

  handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.props.formValidate(PasswordChangePage.PAGE_NAME);
    this.props.changePasswordInit(PasswordChangePage.PAGE_NAME);
  };

  render() {
    const { store: { inputs, isSubmitted } } = this.props;
    return (
      <Page className={style.page} title="Change password" cancelLink={this.getReferrer()}>
        <Form onSubmit={this.handleSubmit}>
          <InputControl
            label="New password"
            isInput
            type="password"
            name="newPassword"
            handleChange={(value, inputName) => this.handleInputChange(value, inputName)}
            value={inputs.newPassword.value}
            errorMessage={inputs.newPassword.errorMsg}
          />
          <InputControl
            label="Repeat new password"
            isInput
            type="password"
            name="repeatedPassword"
            handleChange={(value, inputName) => this.handleInputChange(value, inputName)}
            value={inputs.repeatedPassword.value}
            errorMessage={inputs.repeatedPassword.errorMsg}
          />
          <InputControl
            label="Current password"
            isInput
            type="password"
            name="currentPassword"
            handleChange={(value, inputName) => this.handleInputChange(value, inputName)}
            value={inputs.currentPassword.value}
            errorMessage={inputs.currentPassword.errorMsg}
          />
          <div className={style.buttons}>
            <ButtonLink
              className={style.cancel}
              to={this.getReferrer()}
              inverse
              icon="left"
              layout="info"
              disabled={isSubmitted}
            >
              <FontAwesomeIcon icon={faTimes} /> Cancel
            </ButtonLink>
            <Button
              type="submit"
              icon="right"
              layout="info"
              disabled={isSubmitted}
            >
              Save <FontAwesomeIcon icon={faChevronRight} />
            </Button>
          </div>
        </Form>
      </Page>
    );
  }
}

export default PasswordChangePage;

PasswordChangePage.propTypes = {
  seed: PropTypes.string,
  keys: PropTypes.array,
  store: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  formValidate: PropTypes.func.isRequired,
  changePasswordInit: PropTypes.func.isRequired
};
