import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt, faTimes, faTrashAlt, faSave, faExclamation } from '@fortawesome/free-solid-svg-icons';
import Form from '../components/atoms/Form';
import Button from '../components/atoms/Button';
import ButtonLink from '../components/atoms/ButtonLink';
import Box from '../components/atoms/Box';
import Header from '../components/Header';
import Footer from '../components/Footer';
import style from './SettingsPage.css';

export default class SettingsPage extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      rpcServer: 'https://rpc.adsahres.net',
      isSeedPhraseVisible: false,
    };
  }

  handleInputChange = (event, callback) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    }, callback);
  };

  handleRpcServerSave = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  showSeedPhrase = () => {
    this.setState({
      isSeedPhraseVisible: true
    });
  };

  render() {
    return (
      <div className={style.page}>
        <Header />
        <ButtonLink to="/" size="small" inverse className={style.close}>
          <FontAwesomeIcon icon={faTimes} />
        </ButtonLink>
        <div className={style.contentWrapper}>
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
