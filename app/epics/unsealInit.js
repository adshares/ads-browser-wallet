import { ofType } from 'redux-observable';
import { of, from } from 'rxjs'; // works for RxJS v6
import { mergeMap, withLatestFrom } from 'rxjs/operators';
import { InvalidPasswordError } from '../actions/errors';
import {
  retrieveAccountDataInIntervals,
} from '../actions/actions';
import * as vaultActions from '../actions/vault';
import VaultCrypt from '../utils/vaultcrypt';
import BgClient from '../utils/background';

export default (action$, state$) => action$.pipe(
  ofType(vaultActions.UNSEAL_INIT),
  withLatestFrom(state$),
  mergeMap(([action, state]) => {
    const { vault } = state;
    if (!VaultCrypt.checkPassword(vault, action.password)) {
      throw new InvalidPasswordError();
    }

    BgClient.startSession(window.btoa(action.password));
    const selectedAccount = localStorage.getItem('selectedAccount') || null;
    const unsealedVault = {
      ...VaultCrypt.decrypt(vault, action.password),
      selectedAccount,
    };
    return unsealedVault.selectedAccount ?
      from([
        vaultActions.unseal(unsealedVault),
        retrieveAccountDataInIntervals()
      ]) :
      of(
        vaultActions.unseal(unsealedVault),
      );
  })
);
