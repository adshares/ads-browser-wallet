import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faTimes } from '@fortawesome/free-solid-svg-icons/index';
import FormPage from '../components/FormPage';
import Form from '../components/atoms/Form';
import Button from '../components/atoms/Button';
import ButtonLink from '../components/atoms/ButtonLink';
import ADS from '../utils/ads';
import style from './EditAccountPage.css';

export default class EditAccountPage extends FormPage {

  constructor(props) {
    super(props);

    const { address } = this.props.match.params;

    this.state = {
      name: '',
      address: '',
      publicKey: '',
      isSubmitted: false,
    };
  }

  validateAddress() {
    const addressInput = document.querySelector('[name=address]');
    if (!ADS.validateAddress(this.state.address)) {
      addressInput.setCustomValidity('Please provide an valid account address');
      return false;
    }

    addressInput.setCustomValidity('');
    return true;
  }

  handleAddressChange = (event) => {
    this.handleInputChange(event, this.validateAddress);
  };

  handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    // if (this.validateSeedPhrase() && this.validatePasswords()) {
    //   this.setState({
    //     isSubmitted: true
    //   }, () => {
    //     setTimeout(() => {
    //       this.props.restoreAction(this.state.password, this.state.seedPhrase, this.props.history.push('/'));
    //     }, 100);
    //   });
    // }
  };

  render() {
    return (
      <div className={style.page}>
        <header>
          <h1>Import new account</h1>
        </header>
        <Form onSubmit={this.handleSubmit}>
          <div>
            <input
              required
              placeholder="Account name"
              name="name"
              value={this.state.name}
              onChange={this.handleInputChange}
            />
          </div>
          <div>
            <input
              required
              placeholder="Account address"
              name="address"
              value={this.state.address}
              onChange={this.handleAddressChange}
            />
          </div>
          <div>
            <textarea
              required
              pattern="[0-9a-fA-F]{64}"
              placeholder="Account public key"
              name="publicKey"
              value={this.state.publicKey}
              onChange={this.handleInputChange}
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
              Save <FontAwesomeIcon icon={faChevronRight} />
            </Button>
          </div>
        </Form>
      </div>
    );
  }
}

EditAccountPage.propTypes = {
  vault: PropTypes.object.isRequired,
  saveAction: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};
