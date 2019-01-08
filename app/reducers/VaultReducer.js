import * as actions from '../actions/vaultActions';
import * as KeyBox from '../utils/keybox';
import VaultCrypt from '../utils/vaultcrypt';
import BgClient from '../../app/utils/background';
import ADS from '../../app/utils/ads';
import config from '../config/config';
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
        if (action.callback) {
          action.callback();
        }
      });
      return initialVault;
    }

    case actions.SELECT_ACTIVE_ACCOUNT: {
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
        selectedAccount: vault.selectedAccount || action.unsealedVault.selectedAccount,
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
        selectedAccount: vault.selectedAccount,
        secret: vault.secret,
        empty: vault.empty,
        sealed: true,
      };
    }

    case actions.SWITCH_NETWORK: {
      BgClient.changeNetwork(action.testnet);
      return vault;
    }

    case actions.SAVE_ACCOUNT: {
      const { nodeId, userAccountId } = ADS.splitAddress(action.address);
      const address = ADS.formatAddress(nodeId, userAccountId);

      const updatedVault = {
        ...initialVault,
        ...vault,
        accounts: [
          ...vault.accounts.filter(a => a.address !== address),
          {
            address,
            name: action.name
          }]
      };

      updatedVault.secret = VaultCrypt.save(updatedVault, action.password, action.callback);
      return updatedVault;
    }

    case actions.REMOVE_ACCOUNT: {
      const accounts = vault.accounts.filter(a => a.address !== action.address);
      let selectedAccount = vault.selectedAccount;
      if (selectedAccount === action.address) {
        selectedAccount = accounts.length > 0 ? accounts[0].address : null;
      }

      const updatedVault = {
        ...vault,
        accounts,
        selectedAccount
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

    case actions.SAVE_KEY: {
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
