import { ofType } from 'redux-observable';
import { of, concat } from 'rxjs';
import { mergeMap, withLatestFrom } from 'rxjs/operators';
import {
  retrieveAccountDataInIntervals,
  retrieveAccountDataInIntervalsStop,
} from '../actions/actions';
import * as vaultActions from '../actions/vaultActions';
import VaultCrypt from '../utils/vaultcrypt';
import BgClient from '../utils/background';
import { getReferrer } from './helpers';

export default (action$, state$, { history }) => action$.pipe(
  ofType(vaultActions.UNSEAL),
  withLatestFrom(state$),
  mergeMap(([action, state]) => {
    const { vault } = state;

    if (!VaultCrypt.checkPassword(vault, action.password)) {
      return of(vaultActions.unsealFailure('Invalid password'));
    }

    BgClient.startSession(window.btoa(action.password));
    const unsealedVault = {
      ...VaultCrypt.decrypt(vault, action.password),
    };
    history.push(getReferrer(history));
    return concat(
      of(vaultActions.unsealSuccess(unsealedVault)),
      of(retrieveAccountDataInIntervalsStop()),
      of(retrieveAccountDataInIntervals())
    );
  })
);
