import { ofType } from 'redux-observable';
import { of, from, timer } from 'rxjs'; // works for RxJS v6
import { mergeMap, catchError, withLatestFrom, switchMap, takeUntil, take, filter } from 'rxjs/operators';
import { RpcError } from '../actions/errors';
import {
  ADS_WALLET_INIT,
  RETRIEVE_ACCOUNT_DATA_IN_INTERVALS,
  RETRIEVE_ACCOUNT_DATA_IN_INTERVALS_STOP,
  retrieveAccountDataInIntervalsFailure,
  retrieveAccountDataInIntervalsSuccess,
} from '../actions/actions';
import * as vaultActions from '../actions/vault';

export default (action$, state$, { adsRpc }) => action$.pipe(
  ofType(ADS_WALLET_INIT, RETRIEVE_ACCOUNT_DATA_IN_INTERVALS, vaultActions.SELECT_ACTIVE_ACCOUNT),
  take(1),
  mergeMap(() =>
    timer(0, 5000)
      .pipe(
        withLatestFrom(state$),
        filter(([, state]) => state.vault.selectedAccount),
        switchMap(([, state]) =>
          from(adsRpc.getAccount(state.vault.selectedAccount))
            .pipe(
              mergeMap(account => of(retrieveAccountDataInIntervalsSuccess(account))),
              catchError(error => of(retrieveAccountDataInIntervalsFailure(
                error instanceof RpcError ? error.message : 'Unknown error'
              )))
            )
        ),
        takeUntil(action$.pipe(
          ofType(RETRIEVE_ACCOUNT_DATA_IN_INTERVALS_STOP)
          )
        ),
      ),
    )
);
