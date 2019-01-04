import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faTimes, faExclamation, faCheck } from '@fortawesome/free-solid-svg-icons';
import Page from '../../components/Page/Page';
import PageComponent from '../../components/PageComponent';
import InputControl from '../../components/atoms/InputControl';
import Form from '../../components/atoms/Form';
import Box from '../../components/atoms/Box';
import ButtonLink from '../../components/atoms/ButtonLink';
import Button from '../../components/atoms/Button';
import style from './SettingsPage.css';
import { inputChange, formValidate, formClean } from '../../actions/form';
import { changePasswordInit } from '../../actions/settingsActions';


class PasswordChangePage extends PageComponent {
  static PAGE_NAME = 'SettingsPage';

  handleInputChange = (inputValue, inputName) => {
    this.props.actions.handleInputChange(
      PasswordChangePage.PAGE_NAME,
      inputName,
      inputValue,
    );
  };

  handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.props.actions.formValidate(PasswordChangePage.PAGE_NAME);
    this.props.actions.changePasswordInit(PasswordChangePage.PAGE_NAME);
  };

  handleCloseForm = () => {
    this.props.actions.formClean(PasswordChangePage.PAGE_NAME);
  };

  render() {
    const {
      page: {
        isSubmitted,
        isPasswordChanged,
        errorMsg,
        inputs: { newPassword, repeatedPassword, currentPassword },
      }
    } = this.props;
    return (
      <Page
        className={style.page}
        title="Change password"
        cancelLink={this.getReferrer()}
        onCancelClick={this.handleCloseForm}
        showLoader={isSubmitted}
        history={history}
      >
        {errorMsg ? <Box title="Error" layout="warning" icon={faExclamation}>
          {errorMsg}
        </Box> : ''}
        {isPasswordChanged ?
          <React.Fragment>
            <Box title="Success" layout="success" icon={faCheck}>
              Password has been change
            </Box>
            <ButtonLink
              to={this.getReferrer()}
              onClick={this.handleCloseForm}
              icon="left"
              layout="info"
              size="wide"
            >
              <FontAwesomeIcon icon={faTimes} /> Close
            </ButtonLink>
          </React.Fragment> :
          <Form onSubmit={this.handleSubmit}>
            <InputControl
              label="New password"
              isInput
              type="password"
              name="newPassword"
              handleChange={this.handleInputChange}
              value={newPassword.value}
              errorMessage={newPassword.errorMsg}
            />
            <InputControl
              label="Repeat new password"
              isInput
              type="password"
              name="repeatedPassword"
              handleChange={this.handleInputChange}
              value={repeatedPassword.value}
              errorMessage={repeatedPassword.errorMsg}
            />
            <InputControl
              label="Current password"
              isInput
              type="password"
              name="currentPassword"
              handleChange={this.handleInputChange}
              value={currentPassword.value}
              errorMessage={currentPassword.errorMsg}
            />
            <div className={style.buttons}>
              <ButtonLink
                className={style.cancel}
                to={this.getReferrer()}
                onClick={this.handleCloseForm}
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
        }
      </Page>
    );
  }
}

export default connect(
  state => ({
    vault: state.vault,
    page: state.pages.SettingsPage
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        handleInputChange: inputChange,
        formValidate,
        formClean,
        changePasswordInit,
      },
      dispatch
    )
  })
)(PasswordChangePage);

PasswordChangePage.propTypes = {
  history: PropTypes.object.isRequired,
  vault: PropTypes.object.isRequired,
};
