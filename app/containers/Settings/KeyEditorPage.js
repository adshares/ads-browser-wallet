import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronRight,
  faExclamation,
  faInfo,
  faTimes,
  faCheck
} from '@fortawesome/free-solid-svg-icons';
import FormComponent from '../../components/FormComponent';
import Form from '../../components/atoms/Form';
import Button from '../../components/atoms/Button';
import ButtonLink from '../../components/atoms/ButtonLink';
import Box from '../../components/atoms/Box';
import Page from '../../components/Page/Page';
import InputControl from '../../components/atoms/InputControl';
import { inputChange, cleanForm, toggleVisibility } from '../../actions/formActions';
import { SAVE_KEY, saveKey } from '../../actions/settingsActions';
import CheckboxControl from '../../components/atoms/CheckboxControl';
import style from './SettingsPage.css';
import config from '../../config/config';

class KeyEditorPage extends FormComponent {

  static propTypes = {
    history: PropTypes.object.isRequired,
    vault: PropTypes.object.isRequired,
    page: PropTypes.object.isRequired,
    actions: PropTypes.shape({
      inputChange: PropTypes.func.isRequired,
      toggleVisibility: PropTypes.func.isRequired,
      cleanForm: PropTypes.func.isRequired,
      saveKey: PropTypes.func.isRequired,
    })
  };

  handleInputChange = (inputValue, inputName) => {
    this.props.actions.inputChange(
      SAVE_KEY,
      inputName,
      inputValue,
    );
  };

  toggleVisibility = (inputName, shown) => {
    this.props.actions.toggleVisibility(
      SAVE_KEY,
      inputName,
      shown,
    );
  };

  handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.props.actions.saveKey(SAVE_KEY);
  };

  componentWillUnmount() {
    this.props.actions.cleanForm(SAVE_KEY);
  }

  render() {
    const {
      vault,
      page: {
        isSubmitted,
        errorMsg,
        inputs: { name, secretKey, publicKey }
      }
    } = this.props;
    const limitWarning = vault.keys.filter(
        key => key.type === 'imported'
      ).length >= config.importedKeysLimit;

    return (
      <Page
        className={style.page}
        title="Import key"
        cancelLink={this.getReferrer()}
        showLoader={isSubmitted}
        history={history}
      >
        {limitWarning ? (
          <div>
            <Box layout="warning" icon={faInfo}>
              Maximum keys limit has been reached. Please remove unused keys.
            </Box>
            <ButtonLink to={this.getReferrer()} icon="left" size="wide" layout="info">
              <FontAwesomeIcon icon={faCheck} /> OK
            </ButtonLink>
          </div>
        ) : (
          <React.Fragment>
            {errorMsg ? <Box title="Error" layout="danger" icon={faExclamation}>
              {errorMsg}
            </Box> : ''}
            <Box icon={faInfo} layout="warning">
              This key will NOT be recovered after storage erase.
            </Box>
            <Form onSubmit={this.handleSubmit}>
              <InputControl
                label="Name"
                name="name"
                isInput
                value={name.value}
                handleChange={this.handleInputChange}
                errorMessage={name.errorMsg}
              />
              <InputControl
                label="Secret key"
                name="secretKey"
                rows={2}
                value={secretKey.value}
                errorMessage={secretKey.errorMsg}
                handleChange={this.handleInputChange}
              />
              <CheckboxControl
                label="Double check the key"
                checked={publicKey.checked}
                handleChange={value => this.toggleVisibility('publicKey', value)}
              />
              {publicKey.shown &&
                <InputControl
                  label="Public key"
                  name="publicKey"
                  rows={2}
                  value={publicKey.value}
                  errorMessage={publicKey.errorMsg}
                  handleChange={this.handleInputChange}
                />
              }
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
                  Import <FontAwesomeIcon icon={faChevronRight} />
                </Button>
              </div>
            </Form>
          </React.Fragment>
        )}
      </Page>
    );
  }
}

export default withRouter(connect(
  state => ({
    vault: state.vault,
    page: state.pages[SAVE_KEY]
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        inputChange,
        toggleVisibility,
        cleanForm,
        saveKey,
      },
      dispatch
    )
  })
)(KeyEditorPage));
