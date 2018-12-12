import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faTimes } from '@fortawesome/free-solid-svg-icons/index';
import FormPage from '../../components/FormPage';
import Form from '../../components/atoms/Form';
import Button from '../../components/atoms/Button';
import ButtonLink from '../../components/atoms/ButtonLink';
import LoaderOverlay from '../../components/atoms/LoaderOverlay';
import ADS from '../../utils/ads';
import style from './ImportKeysPage.css';
import { InvalidPasswordError } from '../../actions/errors';

export default class ImportKeysPage extends FormPage {

  handleNameChange = (event) => {
    this.validateName();
  };

  handlePublicKeyChange = (event) => {
    this.handleInputChange(event, this.validatePublicKey);
  };

  handleSecretKeyChange = (event) => {
    this.handleInputChange(event, this.validateSecretKey);
  };

  handleSignatureChange = (event) => {
    this.handleInputChange(event, this.validateSignature);
  };
  handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (this.validateName() && this.validateSecretKey() && this.validatePublicKey() && this.validateSignature()) {
      this.setState({
        isSubmitted: true
      }, () => {
        setTimeout(() => {
          try {
            this.props.saveAction(
              this.nameInput.current.value,
              this.publicKeyInput.current.value,
              this.secretKeyInput.current.value,
              this.signatureInput.current.value,
              this.props.history.push('/'));
          } catch (err) {
            if (err instanceof InvalidPasswordError) {
              this.setState({
                isSubmitted: false
              }, () => {
                const password = document.querySelector('[name=password]');
                password.setCustomValidity(err.message);
                password.reportValidity();
              });
            } else {
              throw err;
            }
          }
        }, 100);
      });
    }
  };

  constructor(props) {
    super(props);
    this.nameInput = React.createRef();
    this.publicKeyInput = React.createRef();
    this.secretKeyInput = React.createRef();
    this.signatureInput = React.createRef();

    this.state = {
      isSubmitted: false,
    };
  }

  validateName() {
    const value = this.nameInput.current.value;
    console.log('v', value);
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

  validateSignature() {
    const value = this.signatureInput.current.value;
    if (value.length > 0 && (value.length !== 128 ||
      !ADS.validateSignature(value, this.publicKeyInput.current.value, this.secretKeyInput.current.value))) {
      this.signatureInput.current.setCustomValidity('Please provide valid signature');
      return false;
    }
    this.signatureInput.current.setCustomValidity('');
    return true;
  }

  render() {
    return (
      <div className={style.page}>
        {this.state.isSubmitted && <LoaderOverlay />}
        <header>
          <h1>
            Import key
          </h1>
        </header>
        <Form onSubmit={this.handleSubmit}>
          <div>
            <input
              ref={this.nameInput}
              required
              placeholder="Key name"
              onChange={this.handleNameChange}
            />
          </div>
          <div>
            <textarea
              ref={this.publicKeyInput}
              required
              pattern="[0-9a-fA-F]{64}"
              placeholder="Public key"
              value={this.state.publicKey}
              onChange={this.handlePublicKeyChange}
            />
          </div>
          <div>
            <textarea
              ref={this.secretKeyInput}
              required
              pattern="[0-9a-fA-F]{64}"
              placeholder="Secret key"
              onChange={this.handleSecretKeyChange}
            />
          </div>
          <div>
            <textarea
              ref={this.signatureInput}
              placeholder="Signature"
              onChange={this.handleSignatureChange}
            />
          </div>

          <div className={style.buttons}>
            <ButtonLink
              className={style.cancel} to={'/'} inverse icon="left"
              disabled={this.state.isSubmitted}
            >
              <FontAwesomeIcon icon={faTimes} /> Cancel
            </ButtonLink>
            <Button
              type="submit" icon="right"
              disabled={this.state.isSubmitted}
            >
              {this.state.accountAddress ? 'Save' : 'Import'}
              <FontAwesomeIcon icon={faChevronRight} />
            </Button>
          </div>
        </Form>
      </div>
    );
  }
}

ImportKeysPage.propTypes = {
  vault: PropTypes.object.isRequired,
  saveAction: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};
