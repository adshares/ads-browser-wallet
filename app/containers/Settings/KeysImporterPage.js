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
import ConfirmDialog from '../../components/confirmDialog/confirmDialog';
import LoaderOverlay from '../../components/atoms/LoaderOverlay';
import ADS from '../../utils/ads';
import Page from '../../components/Page/Page';
import style from './SettingsPage.css';
import FormControl from '../../components/atoms/FormControl';
import * as ActionTypes from '../../constants/ActionTypes';

import { handleInputChange, handlePasswordChange } from '../../actions/form';
import validateFormThunk from '../../thunks/validateThunk';
import passwordValidateThunk from '../../thunks/passwordValidateThunk';

@connect(
  state => ({
    vault: state.vault,
    page: state.pages.KeysImporterPage
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        handleInputChange,
        handlePasswordChange,
        validateFormThunk,
        passwordValidateThunk
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

  handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.props.actions.validateFormThunk(KeysImporterPage.PAGE_NAME);
  };

  onAuthenticated = (password) => {
    this.setState({
      isSubmitted: false,
      showLoader: true
    });

    try {
      this.props.saveAction(
        this.nameInput.current.value,
        this.publicKeyInput.current.value,
        this.secretKeyInput.current.value,
        password
      );
      this.props.history.push('/');
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  constructor(props) {
    super(props);
    this.nameInput = React.createRef();
    this.publicKeyInput = React.createRef();
    this.secretKeyInput = React.createRef();

    this.state = {
      isSubmitted: false,
      password: null,
      showLoader: false
    };
  }

  render() {
    const {
      vault,
      page: {
        auth: { authModalOpen, authConfirmed, password },
        isSubmitted,
        inputs: { name, publicKey, secretKey }
      }
    } = this.props;

    return (
      <Page
        className={style.page}
        title="Import key"
        onPasswordInputChange={e =>
          this.props.actions.handlePasswordChange(
            KeysImporterPage.PAGE_NAME,
            e.target.value
          )
        }
        onDialogSubmit={() =>
          this.props.actions.passwordValidateThunk(
            KeysImporterPage.PAGE_NAME,
            ActionTypes.IMPORT_KEY
          )
        }
        passwordValue={password.value}
        autenticationModalOpen={authModalOpen}
        cancelLink={'/'}
      >
        {this.state.showLoader && <LoaderOverlay />}
        <Form onSubmit={this.handleSubmit}>
          <FormControl
            label="Name"
            value={name.value}
            isValid={name.isValid}
            required
            isInput
            handleChange={value => this.handleInputChange('name', value)}
            errorMessage={name.errorMsg}
          />
          <FormControl
            label="Public key"
            value={publicKey.value}
            isValid={publicKey.isValid}
            required
            pattern="[0-9a-fA-F]{64}"
            errorMessage={publicKey.errorMsg}
            handleChange={value => this.handleInputChange('publicKey', value)}
          />
          <FormControl
            label="Secret key"
            value={secretKey.value}
            isValid={secretKey.isValid}
            required
            pattern="[0-9a-fA-F]{64}"
            errorMessage={secretKey.errorMsg}
            handleChange={value => this.handleInputChange('secretKey', value)}
          />

          <div className={style.buttons}>
            <ButtonLink
              className={style.cancel}
              to={'/'}
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

KeysImporterPage.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  vault: PropTypes.object.isRequired,
  saveAction: PropTypes.func.isRequired
};
