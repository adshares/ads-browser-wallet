import * as actions from '../actions/vault';
import KeyBox from '../utils/keybox';
import VaultCrypt from '../utils/vaultcrypt';
import BgClient from '../../app/utils/background';
import {
  InvalidPasswordError,
  AccountsLimitError,
  UnknownPublicKeyError,
  ItemNotFound,
} from '../actions/errors';
import config from '../config';

const initialVault = {
  empty: true,
  sealed: true,
  secret: '',
  seedPhrase: '',
  seed: '',
  keys: [],
  accounts: [],
  selectedAccount: null,
};

export default function (vault = initialVault, action) {

  switch (action.type) {
    case actions.VAULT_CREATE: {
      BgClient.startSession(window.btoa(action.password));
      const seed = KeyBox.seedPhraseToHex(action.seedPhrase);
      const vaultKeys = vault.keys ? vault.keys : [];
      const newVault = {
        ...initialVault,
        ...vault,
        empty: false,
        sealed: false,
        seedPhrase: action.seedPhrase,
        seed,
        keys: [...vaultKeys, ...KeyBox.generateKeys(seed, config.initKeysQuantity)],
        keyCount: config.initKeysQuantity,
      };
      newVault.secret = VaultCrypt.save(newVault, action.password, action.callback);
      return newVault;
    }

    case actions.VAULT_EREASE: {
      //TODO check password
      BgClient.removeSession();
      VaultCrypt.erase();
      return initialVault;
    }

    case actions.SELECT_ACTIVE_ACCOUNT: {
      return {
        ...vault,
        selectedAccount: action.account
      };
    }

    case actions.VAULT_UNSEAL: {
      if (!VaultCrypt.checkPassword(vault, action.password)) {
        throw new InvalidPasswordError();
      }

      BgClient.startSession(window.btoa(action.password));
      const unsealedVault = VaultCrypt.decrypt(vault, action.password);
      return {
        ...initialVault,
        ...vault,
        ...unsealedVault,
        sealed: false,
      };
    }

    case actions.VAULT_SEAL: {
      BgClient.removeSession();
      return {
        ...initialVault,
        secret: vault.secret,
        empty: vault.empty,
        sealed: true,
      };
    }

    case actions.VAULT_ADD_ACCOUNT: {
      if (vault.accounts.length >= config.accountsLimit) {
        throw new AccountsLimitError(config.accountsLimit);
      }
      const address = action.address.toUpperCase();
      const name = action.name;
      const publicKey = action.publicKey.toUpperCase();
      const key = vault.keys.find(k => k.publicKey === action.publicKey);
      console.log('\n', key, '\n');
      const updatedVault = {
        ...initialVault,
        ...vault,
        accounts: [
          ...vault.accounts,
          {
            address,
            name,
            publicKey,
            secretKey: key.secretKey,
          }]
      };
      updatedVault.secret = VaultCrypt.save(updatedVault, action.password, action.callback);
      return updatedVault;
    }

    case actions.VAULT_UPDATE_ACCOUNT: {
      if (!VaultCrypt.checkPassword(vault, action.password)) {
        throw new InvalidPasswordError();
      }

      const address = action.address.toUpperCase();
      const name = action.name;
      const publicKey = action.publicKey.toUpperCase();
      const key = vault.keys.find(k => k.publicKey === publicKey);

      if (!key) {
        throw new UnknownPublicKeyError(action.publicKey);
      }

      const account = vault.accounts.find(a => a.address === address);
      if (!account) {
        throw new ItemNotFound('account', action.address);
      }

      account.name = name;
      account.publicKey = publicKey;
      account.secretKey = key.secretKey;

      const updatedVault = {
        ...initialVault,
        ...vault,
      };
      updatedVault.secret = VaultCrypt.save(updatedVault, action.password, action.callback);

      return updatedVault;
    }

    case actions.VAULT_REMOVE_ACCOUNT: {
      if (!VaultCrypt.checkPassword(vault, action.password)) {
        throw new InvalidPasswordError();
      }

      const address = action.address.toUpperCase();
      const account = vault.accounts.find(a => a.address === address);
      if (!account) {
        throw new ItemNotFound('account', action.address);
      }

      const updatedVault = {
        ...initialVault,
        ...vault,
      };
      updatedVault.accounts = vault.accounts.filter(a => a.address !== address);
      updatedVault.secret = VaultCrypt.save(updatedVault, action.password, action.callback);

      return updatedVault;
    }

    case actions.VAULT_IMPORT_KEY: {
      const updatedVault = {...vault};
      updatedVault.keys.push({
        type: 'imported',
        name: action.name,
        secretKey: action.secretKey,
        publicKey: action.publicKey,
      });
      updatedVault.secret = VaultCrypt.save(updatedVault, action.password, action.callback);
      return updatedVault;
    }
    default:
      return vault;
  }
}
