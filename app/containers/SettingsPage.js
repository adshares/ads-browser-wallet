import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShieldAlt,
  faTimes,
  faTrashAlt,
  faSave,
  faExclamation,
  faPlus,
  faPencilAlt,
  faKey,
} from '@fortawesome/free-solid-svg-icons';
import FormPage from '../components/FormPage';
import Form from '../components/atoms/Form';
import Button from '../components/atoms/Button';
import ButtonLink from '../components/atoms/ButtonLink';
import Box from '../components/atoms/Box';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import style from './SettingsPage.css';

export default class SettingsPage extends FormPage {

  constructor(props) {
    super(props);
    this.state = {
      rpcServer: 'https://rpc.adsahres.net',
      isSeedPhraseVisible: false,
    };
  }

  handleRpcServerSave = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  showSeedPhrase = () => {
    this.setState({
      isSeedPhraseVisible: true
    });
  };

  showAccountKeys = () => {
    console.debug('show');
  };

  removeAccount = () => {
    console.debug('remove');
  };

  render() {
    const vault = this.props.vault;

    return (
      <div className={style.page}>
        <Header />
        <ButtonLink to="/" size="small" inverse className={style.close}>
          <FontAwesomeIcon icon={faTimes} />
        </ButtonLink>
        <div className={style.contentWrapper}>
          <h3>Accounts</h3>
          {vault.accounts.length &&
            <ul>
              {vault.accounts.map((account, index) =>
                <li key={index}>
                  <span>{account.address}</span>
                  <small>{account.name}</small>
                  <Button onClick={this.showAccountKeys} size="small">
                    <FontAwesomeIcon icon={faKey} />
                  </Button>
                  <ButtonLink
                    to={{
                      pathname: `/accounts/${account.address}/edit`,
                      state: { referrer: this.props.location }
                    }}
                    size="small"
                  >
                    <FontAwesomeIcon icon={faPencilAlt} />
                  </ButtonLink>
                  <Button onClick={this.removeAccount} size="small" layout="danger">
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </Button>
                </li>
              )}
            </ul>
          }
          <ButtonLink
            to={{
              pathname: '/accounts/import',
              state: { referrer: this.props.location }
            }}
            icon="left"
            size="wide"
          >
            <FontAwesomeIcon icon={faPlus} /> Add account
          </ButtonLink>
          <h3>RPC server</h3>
          <Form onSubmit={this.handleRpcServerSave}>
            <div>
              <input
                required
                placeholder="RPC server URL"
                name="rpcServer"
                value={this.state.rpcServer}
                onChange={this.handleInputChange}
              />
            </div>
            <Button type="submit" icon="left" size="wide">
              <FontAwesomeIcon icon={faSave} /> Change
            </Button>
          </Form>
          <h3>Reveal seed phrase</h3>
          <Form>
            {this.state.isSeedPhraseVisible ?
              <div>
                <Box layout="warning" icon={faExclamation}>
                  Store the seed phrase safely. Only the public key and signatures can be revealed.
                  The seed phrase must not be transferred to anyone.
                </Box>
                <textarea
                  value={this.props.vault.seedPhrase}
                  readOnly
                />
              </div> :
              <Button layout="danger" icon="left" size="wide" onClick={this.showSeedPhrase}>
                <FontAwesomeIcon icon={faShieldAlt} /> Reveal seed phrase
              </Button>
            }
          </Form>
          <h3>Erase storage</h3>
          <Button layout="danger" icon="left" size="wide" onClick={this.props.ereaseAction}>
            <FontAwesomeIcon icon={faTrashAlt} /> Erase storage
          </Button>
        </div>
        <Footer />
      </div>
    );
  }
}

SettingsPage.propTypes = {
  vault: PropTypes.object.isRequired,
  ereaseAction: PropTypes.func.isRequired,
};
