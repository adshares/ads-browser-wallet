import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronRight,
  faTimes
} from '@fortawesome/free-solid-svg-icons/index';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import FormComponent from '../../components/FormComponent';
import Form from '../../components/atoms/Form';
import Button from '../../components/atoms/Button';
import ButtonLink from '../../components/atoms/ButtonLink';
import LoaderOverlay from '../../components/atoms/LoaderOverlay';
import Page from '../../components/Page/Page';
import style from './SettingsPage.css';
import InputControl from '../../components/atoms/InputControl';
import { inputChange, passwordChange, toggleVisibility, passInputValidate, formValidate } from '../../actions/form';
import { importKeyInit } from '../../actions/vaultActions';
import CheckboxControl from '../../components/atoms/CheckboxControl';

class KeysImporterPage extends FormComponent {
  static PAGE_NAME = 'KeysImporterPage';

  handleInputChange = (inputName, inputValue) => {
    this.props.actions.handleInputChange(
      KeysImporterPage.PAGE_NAME,
      inputName,
      inputValue
    );
  };

  toggleVisibility = (inputName, shown) => {
    this.props.actions.toggleVisibility(
      KeysImporterPage.PAGE_NAME,
      inputName,
      shown,
    );
  };

  handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.props.actions.formValidate(KeysImporterPage.PAGE_NAME);
  };

  constructor(props) {
    super(props);
    this.state = {
      showLoader: false
    };
  }

  render() {
    const {
      page: {
        auth: { authModalOpen, password },
        inputs: { name, publicKey, secretKey }
      }
    } = this.props;

    return (
      <Page
        className={style.page}
        title="Import key"
        onPasswordInputChange={value =>
          this.props.actions.handlePasswordChange(
            KeysImporterPage.PAGE_NAME,
            value
          )
        }
        onDialogSubmit={() => {
          this.props.actions.passInputValidate(
            KeysImporterPage.PAGE_NAME,
          );
          this.props.actions.importKeyInit();
        }}
        password={password}
        authenticationModalOpen={authModalOpen}
        cancelLink={this.getReferrer()}
      >
        {this.state.showLoader && <LoaderOverlay />}
        <Form onSubmit={this.handleSubmit}>
          <InputControl
            label="Name"
            value={name.value}
            isValid={name.isValid}
            required
            isInput
            handleChange={value => this.handleInputChange('name', value)}
            errorMessage={name.errorMsg}
          />
          <InputControl
            label="Secret key"
            value={secretKey.value}
            isValid={secretKey.isValid}
            required
            pattern="[0-9a-fA-F]{64}"
            errorMessage={secretKey.errorMsg}
            handleChange={value => this.handleInputChange('secretKey', value)}
          />
          <CheckboxControl
            checked={publicKey.checked} label="Import with public key"
            handleChange={value => this.toggleVisibility('publicKey', value)}
          />
          {publicKey.shown &&
          <InputControl
            label="Public key"
            value={publicKey.value}
            isValid={publicKey.isValid}
            required
            pattern="[0-9a-fA-F]{64}"
            errorMessage={publicKey.errorMsg}
            handleChange={value => this.handleInputChange('publicKey', value)}
          />
          }
          <div className={style.buttons}>
            <ButtonLink
              className={style.cancel}
              to={this.getReferrer()}
              inverse
              icon="left"
              layout="info"
              disabled={this.state.isSubmitted}
            >
              <FontAwesomeIcon icon={faTimes} /> Cancel
            </ButtonLink>
            <Button
              type="submit"
              icon="right"
              layout="info"
              disabled={this.state.isSubmitted}
            >
              {this.state.account ? 'Save' : 'Import'}
              <FontAwesomeIcon icon={faChevronRight} />
            </Button>
          </div>
        </Form>
      </Page>
    );
  }
}

export default connect(
  state => ({
    vault: state.vault,
    page: state.pages.KeysImporterPage
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        handleInputChange: inputChange,
        handlePasswordChange: passwordChange,
        formValidate,
        passInputValidate,
        toggleVisibility,
        importKeyInit,
      },
      dispatch
    )
  })
)(KeysImporterPage);

KeysImporterPage.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  vault: PropTypes.object.isRequired,
};
