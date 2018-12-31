import { ofType } from 'redux-observable';
import { of, concat } from 'rxjs';
import { mergeMap, withLatestFrom } from 'rxjs/operators';
import { InvalidPasswordError } from '../actions/errors';
import {
  retrieveAccountDataInIntervals,
  retrieveAccountDataInIntervalsStop,
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
    const unsealedVault = {
      ...VaultCrypt.decrypt(vault, action.password),
    };
    return concat(
      of(vaultActions.unseal(unsealedVault)),
      of(retrieveAccountDataInIntervalsStop()),
      of(retrieveAccountDataInIntervals())
    );
  })
);
