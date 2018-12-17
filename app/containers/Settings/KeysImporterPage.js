import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faTimes } from '@fortawesome/free-solid-svg-icons/index';
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

export default class KeysImporterPage extends FormComponent {

  handleNameChange = () => {
    this.validateName();
  };

  handlePublicKeyChange = (event) => {
    this.handleInputChange(event, this.validatePublicKey);
  };

  handleSecretKeyChange = (event) => {
    this.handleInputChange(event, this.validateSecretKey);
  };

  handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (this.validateName() && this.validateSecretKey() && this.validatePublicKey()) {
      this.setState({
        isSubmitted: true
      });
    }
  };
  onAuthenticated = (password) => {
    this.setState({
      isSubmitted: false,
      showLoader: true,
    });

    try {
      this.props.saveAction(
        this.nameInput.current.value,
        this.publicKeyInput.current.value,
        this.secretKeyInput.current.value,
        password);
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
      showLoader: false,
    };
  }

  validateName() {
    const value = this.nameInput.current.value;
    if (this.props.vault.keys.find(
      key => key.name === value
    )) {
      this.nameInput.current.setCustomValidity(`Key named ${value} already exists`);
      return false;
    }
    this.nameInput.current.setCustomValidity('');
    return true;
  }

  validatePublicKey() {
    const value = this.publicKeyInput.current.value;
    if (!ADS.validateKey(value)) {
      this.publicKeyInput.current.setCustomValidity('Please provide an valid public key');
      return false;
    }
    this.publicKeyInput.current.setCustomValidity('');
    return true;
  }

  validateSecretKey() {
    const value = this.secretKeyInput.current.value;

    if (!ADS.validateKey(value)) {
      this.secretKeyInput.current.setCustomValidity('Please provide an valid public key');
      return false;
    }
    this.secretKeyInput.current.setCustomValidity('');
    return true;
  }

  render() {
    const { vault } = this.props;
    return (
      <Page className={style.page} title="Import key">
        {this.state.showLoader && <LoaderOverlay />}
        <ConfirmDialog
          showDialog={this.state.isSubmitted}
          vault={vault} onAuthenticated={this.onAuthenticated}
        />
        <Form onSubmit={this.handleSubmit}>
          <FormControl label="Name" value="" required isInput />
          <FormControl
            label="Public key"
            value=""
            required
            pattern="[0-9a-fA-F]{64}"
          />
          <FormControl
            label="Secret key"
            value=""
            required
            pattern="[0-9a-fA-F]{64}"
          />

          <div className={style.buttons}>
            <ButtonLink
              className={style.cancel} to={'/'} inverse icon="left" layout="info"
              disabled={this.state.isSubmitted}
            >
              <FontAwesomeIcon icon={faTimes} /> Cancel
            </ButtonLink>
            <Button
              type="submit" icon="right" layout="info"
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
  saveAction: PropTypes.func.isRequired,
};
