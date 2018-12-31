import { ofType } from 'redux-observable';
import { of, from, timer } from 'rxjs';
import {
  mergeMap,
  catchError,
  withLatestFrom,
  switchMap,
  takeUntil,
  filter
} from 'rxjs/operators';
import { RpcError } from '../actions/errors';
import {
  ADS_WALLET_INIT,
  RETRIEVE_ACCOUNT_DATA_IN_INTERVALS,
  RETRIEVE_ACCOUNT_DATA_IN_INTERVALS_STOP,
  RETRIEVE_NODES_DATA_IN_INTERVALS,
  RETRIEVE_NODES_DATA_IN_INTERVALS_STOP,
  retrieveAccountDataInIntervalsFailure,
  retrieveAccountDataInIntervalsSuccess,
  retrieveNodesDataInIntervalsFailure,
  retrieveNodesDataInIntervalsSuccess,
} from '../actions/actions';

export const retrieveAccountEpic = (action$, state$, { adsRpc }) => action$.pipe(
  ofType(ADS_WALLET_INIT, RETRIEVE_ACCOUNT_DATA_IN_INTERVALS),
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

export const retrieveNodesEpic = (action$, state$, { adsRpc }) => action$.pipe(
  ofType(ADS_WALLET_INIT, RETRIEVE_NODES_DATA_IN_INTERVALS),
  mergeMap(() =>
    timer(0, 60000)
      .pipe(
        switchMap(() =>
          from(adsRpc.getNodes())
            .pipe(
              mergeMap(nodes => of(retrieveNodesDataInIntervalsSuccess(nodes))),
              catchError(error => of(retrieveNodesDataInIntervalsFailure(
                error instanceof RpcError ? error.message : 'Unknown error'
              )))
            )
        ),
        takeUntil(action$.pipe(
          ofType(RETRIEVE_NODES_DATA_IN_INTERVALS_STOP)
          )
        ),
      ),
  )
);
