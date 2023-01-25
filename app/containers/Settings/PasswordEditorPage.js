import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import Page from '../../components/Page/Page';
import PageComponent from '../../components/PageComponent';
import InputControl from '../../components/atoms/InputControl';
import Form from '../../components/atoms/Form';
import Box from '../../components/atoms/Box';
import ButtonLink from '../../components/atoms/ButtonLink';
import Button from '../../components/atoms/Button';
import Buttons from '../../components/atoms/Buttons';
import { inputChange, cleanForm } from '../../actions/formActions';
import { CHANGE_PASSWORD, changePassword } from '../../actions/settingsActions';
import config from '../../config/config';
import style from './SettingsPage.css';

class PasswordEditorPage extends PageComponent {
  static propTypes = {
    history: PropTypes.object.isRequired,
    vault: PropTypes.object.isRequired,
    page: PropTypes.object.isRequired,
    actions: PropTypes.shape({
      inputChange: PropTypes.func.isRequired,
      cleanForm: PropTypes.func.isRequired,
      changePassword: PropTypes.func.isRequired,
    })
  };

  handleInputChange = (inputValue, inputName) => {
    this.props.actions.inputChange(
      CHANGE_PASSWORD,
      inputName,
      inputValue,
    );
  };

  handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.props.actions.changePassword(CHANGE_PASSWORD);
  };

  componentWillUnmount() {
    this.props.actions.cleanForm(CHANGE_PASSWORD);
  }

  render() {
    const {
      page: {
        isSubmitted,
        isPasswordChanged,
        errorMsg,
        inputs: { newPassword, repeatedPassword },
      }
    } = this.props;

    return (
      <Page
        className={style.page}
        title="Change password"
        cancelLink={this.getReferrer()}
        showLoader={isSubmitted}
        history={history}
      >
        {errorMsg ? <Box title="Error" layout="danger" icon={'!'}>
          {errorMsg}
        </Box> : ''}
        {isPasswordChanged ?
          <React.Fragment>
            <Box title="Success" layout="warning" icon={'!'}>
              Password has been changed
            </Box>
            <ButtonLink
              to={this.getReferrer()}
              layout="secondary"
            >Back
            </ButtonLink>
          </React.Fragment> :
          <React.Fragment>
            <Box icon={'i'} layout="info">
              Your password should be obscure and must be at
              least {config.passwordMinLength} characters long.
            </Box>
            <Form onSubmit={this.handleSubmit}>
              <InputControl
                label="New password"
                isInput
                type="password"
                name="newPassword"
                handleChange={this.handleInputChange}
                value={newPassword.value}
                errorMessage={newPassword.errorMsg}
                autoFocus
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
              <Buttons>
                <ButtonLink
                  to={this.getReferrer()}
                  layout="secondary"
                  disabled={isSubmitted}
                >Cancel
                </ButtonLink>
                <Button
                  type="submit"
                  layout="primary"
                  disabled={isSubmitted}
                >Save
                </Button>
              </Buttons>
            </Form>
          </React.Fragment>
        }
      </Page>
    );
  }
}

export default withRouter(connect(
  state => ({
    vault: state.vault,
    page: state.pages[CHANGE_PASSWORD]
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        inputChange,
        cleanForm,
        changePassword,
      },
      dispatch
    )
  })
)(PasswordEditorPage));
