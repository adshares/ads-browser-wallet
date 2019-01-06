import * as actions from '../actions/vaultActions';
import * as KeyBox from '../utils/keybox';
import VaultCrypt from '../utils/vaultcrypt';
import BgClient from '../../app/utils/background';
import ADS from '../../app/utils/ads';
import {
  InvalidPasswordError,
  AccountsLimitError,
  ItemNotFound,
} from '../actions/errors';
import config from '../config/config';
import { findAccountByAddressInVault } from '../utils/utils';
import {
  RETRIEVE_ACCOUNT_DATA_IN_INTERVALS_SUCCESS,
  RETRIEVE_NODES_DATA_IN_INTERVALS_SUCCESS
} from '../actions/walletActions';

const initialVault = {
  empty: true,
  sealed: true,
  secret: '',
  seedPhrase: '',
  seed: '',
  keys: [],
  keyCount: config.initKeysQuantity,
  accounts: [],
  selectedAccount: null,
  nodes: [],
  loginErrorMsg: '',
};

export default function (vault = initialVault, action) {
  switch (action.type) {
    case actions.CREATE: {
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
        keys: [...vaultKeys, ...KeyBox.initKeys(seed, config.initKeysQuantity)],
        keyCount: config.initKeysQuantity,
      };
      newVault.secret = VaultCrypt.save(newVault, action.password, action.callback);
      return newVault;
    }

    case actions.CHANGE_PASSWORD: {
      const newVault = {
        ...initialVault,
        ...vault,
      };
      newVault.secret = VaultCrypt.save(newVault, action.password, () => {
        BgClient.startSession(window.btoa(action.password));
        if (action.callback) {
          action.callback();
        }
      });
      return newVault;
    }

    case actions.ERASE: {
      VaultCrypt.erase(() => {
        chrome.storage.local.remove(config.accountStorageKey);
        if (action.callback) {
          action.callback();
        }
      });
      return initialVault;
    }

    case actions.SELECT_ACTIVE_ACCOUNT: {
      chrome.storage.local.remove(config.accountStorageKey);
      return {
        ...vault,
        selectedAccount: action.accountAddress
      };
    }

    case actions.UNSEAL_SUCCESS: {
      return {
        ...initialVault,
        ...vault,
        ...action.unsealedVault,
        loginErrorMsg: '',
        sealed: false,
      };
    }

    case actions.UNSEAL_FAILURE: {
      return {
        ...initialVault,
        ...vault,
        loginErrorMsg: action.errorMsg,
      };
    }

    case actions.SEAL: {
      BgClient.removeSession();
      return {
        ...initialVault,
        secret: vault.secret,
        empty: vault.empty,
        sealed: true,
      };
    }

    case actions.SWITCH_NETWORK: {
      BgClient.changeNetwork(action.testnet);
      return vault;
    }

    case actions.ADD_ACCOUNT: {
      if (vault.accounts.length >= config.accountsLimit) {
        throw new AccountsLimitError(config.accountsLimit);
      }
      const { nodeId, userAccountId } = ADS.splitAddress(action.address);
      const address = ADS.formatAddress(nodeId, userAccountId);
      const name = action.name;

      const updatedVault = {
        ...initialVault,
        ...vault,
        accounts: [
          ...vault.accounts,
          {
            address,
            name
          }]
      };
      updatedVault.secret = VaultCrypt.save(updatedVault, action.password, action.callback);
      return updatedVault;
    }

    case actions.UPDATE_ACCOUNT: {
      if (!VaultCrypt.checkPassword(vault, action.password)) {
        throw new InvalidPasswordError();
      }

      const address = action.address.toUpperCase();
      const name = action.name;

      const account = findAccountByAddressInVault(vault, address);
      if (!account) {
        throw new ItemNotFound('account', action.address);
      }

      account.name = name;
      const updatedVault = {
        ...initialVault,
        ...vault,
      };
      updatedVault.secret = VaultCrypt.save(updatedVault, action.password, action.callback);

      return updatedVault;
    }

    case actions.REMOVE_ACCOUNT: {
      const checkSelectedAccount = action.updatedAccounts.find(
        account => account.address === vault.selectedAccount);
      if (!checkSelectedAccount) {
        chrome.storage.local.remove(config.accountStorageKey);
      }

      const updatedVault = {
        ...initialVault,
        ...vault,
        accounts: action.updatedAccounts,
        selectedAccount: checkSelectedAccount || null
      };
      updatedVault.secret = VaultCrypt.save(updatedVault, action.password, action.callback);

      return updatedVault;
    }

    case actions.GENERATE_KEYS: {
      const keyCount = vault.keyCount + action.quantity;
      const updatedVault = {
        ...vault,
        keys: [
          ...vault.keys,
          ...KeyBox.generateKeys(vault.seed, vault.keyCount, keyCount)
        ],
        keyCount,
      };

      updatedVault.secret = VaultCrypt.save(updatedVault, action.password, action.callback);
      return updatedVault;
    }

    case actions.ADD_KEY: {
      const updatedVault = {
        ...vault,
        keys: [
          ...vault.keys,
          {
            type: 'imported',
            name: action.name,
            secretKey: action.secretKey,
            publicKey: KeyBox.getPublicKeyFromSecret(action.secretKey),
          }
        ]
      };

      updatedVault.secret = VaultCrypt.save(updatedVault, action.password, action.callback);
      return updatedVault;
    }

    case actions.REMOVE_KEY: {
      const updatedVault = {
        ...vault,
        keys: vault.keys.filter(k => k.type === 'auto' || k.publicKey !== action.publicKey)
      };

      updatedVault.secret = VaultCrypt.save(updatedVault, action.password, action.callback);
      return updatedVault;
    }

    case RETRIEVE_ACCOUNT_DATA_IN_INTERVALS_SUCCESS: {
    // eslint-disable-next-line no-confusing-arrow
      const accounts = vault.accounts.map(a => a.address === action.account.address ? {
        ...a,
        ...action.account
      } : a);
      return {
        ...vault,
        accounts,
      };
    }

    case RETRIEVE_NODES_DATA_IN_INTERVALS_SUCCESS: {
      return {
        ...vault,
        nodes: action.nodes,
      };
    }


    default:
      return vault;
  }
}
