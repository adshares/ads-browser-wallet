import React from 'react';
import PropTypes from 'prop-types';
import style from './SettingsPage.css';
import Page from '../../components/Page/Page';
import PageComponent from '../../components/PageComponent';
import { KeysList } from './KeysList';
import { generateNewKeys } from '../../utils/keybox';

class KeysSettings extends PageComponent {
  removeAction = (secretKey) => {
    this.props.toggleAuthDialog(true);
    this.props.removeKeyAction(secretKey);
  };
  showKeysAction = (path) => {
    this.props.toggleAuthDialog(true);
    this.props.showKeys(path);
  };

  generateKeys() {
    const generatedKeys = generateNewKeys(this.props.seed, this.props.keys.length);
    this.props.toggleAuthDialog(true);
    this.props.saveGeneratedKeysAction(generatedKeys);
  }

  render() {
    const { keys, location } = this.props;

    return (
      <Page
        className={style.page} title="Keys Settings" smallTitle
        cancelLink={this.getReferrer()} scroll
      >
        <KeysList
          keys={keys}
          location={location}
          removeAction={secretKey => this.removeAction(secretKey)}
          type="imported"
          showKeys={path => this.showKeysAction(path)}
        />
        <KeysList
          keys={keys}
          location={location}
          type="auto"
          showKeys={path => this.showKeysAction(path)}
          createAction={() => this.generateKeys()}
        />
      </Page>
    );
  }
}

export default KeysSettings;

KeysSettings.propTypes = {
  seed: PropTypes.string,
  keys: PropTypes.array,
  location: PropTypes.object.isRequired,
  saveGeneratedKeysAction: PropTypes.func,
  removeKeyAction: PropTypes.func,
  toggleAuthDialog: PropTypes.func,
  showKeys: PropTypes.func.isRequired,
};

