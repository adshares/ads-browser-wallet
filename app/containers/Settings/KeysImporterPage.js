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
import { InputControl } from '../../components/atoms/InputControl';
import { inputChange, passwordChange, toggleVisibility } from '../../actions/form';
import { VAULT_IMPORT_KEY } from '../../actions/vault';
import validateFormThunk from '../../thunks/formThunk';
import passwordValidateThunk from '../../thunks/passwordValidateThunk';
import { CheckboxControl } from '../../components/atoms/checkboxControl';

@connect(
  state => ({
    vault: state.vault,
    page: state.pages.KeysImporterPage
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        handleInputChange: inputChange,
        handlePasswordChange: passwordChange,
        validateFormThunk,
        passwordValidateThunk,
        toggleVisibility,
      },
      dispatch
    )
  })
)
export default class KeysImporterPage extends FormComponent {
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
    this.props.actions.validateFormThunk(KeysImporterPage.PAGE_NAME);
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
        onDialogSubmit={() =>
          this.props.actions.passwordValidateThunk(
            KeysImporterPage.PAGE_NAME,
            VAULT_IMPORT_KEY
          )
        }
        password={password}
        autenticationModalOpen={authModalOpen}
        cancelLink={'/'}
      >
        {this.state.showLoader && <LoaderOverlay/>}
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
            checked={publicKey.checked} desc="Import with public key"
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
              to={'/'}
              inverse
              icon="left"
              layout="info"
              disabled={this.state.isSubmitted}
            >
              <FontAwesomeIcon icon={faTimes}/> Cancel
            </ButtonLink>
            <Button
              type="submit"
              icon="right"
              layout="info"
              disabled={this.state.isSubmitted}
            >
              {this.state.account ? 'Save' : 'Import'}
              <FontAwesomeIcon icon={faChevronRight}/>
            </Button>
          </div>
        </Form>
      </Page>
    );
  }
}

KeysImporterPage.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  vault: PropTypes.object.isRequired,
  saveAction: PropTypes.func.isRequired
};
