import { ofType } from 'redux-observable';
import { of, from, timer, merge } from 'rxjs';
import {
  mergeMap,
  catchError,
  withLatestFrom,
  switchMap,
  takeUntil,
  filter,
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
  retrieveGatewaysDataFailure,
  retrieveGatewaysDataSuccess,
  retrieveNodesDataInIntervalsFailure,
  retrieveNodesDataInIntervalsSuccess,
} from '../actions/walletActions';

export const retrieveAccountEpic = (action$, state$, { adsRpc }) => action$.pipe(
  ofType(ADS_WALLET_INIT, RETRIEVE_ACCOUNT_DATA_IN_INTERVALS),
  mergeMap(() =>
    timer(0, 5000)
      .pipe(
        withLatestFrom(state$),
        filter(([, state]) => state.vault.accounts && state.vault.accounts.length > 0),
        switchMap(([, state]) => {
          const actions = [];
          state.vault.accounts.forEach((a) => {
            actions.push(from(adsRpc.getAccount(a.address)).pipe(
              mergeMap(account => of(retrieveAccountDataInIntervalsSuccess(account))),
              catchError(error => of(retrieveAccountDataInIntervalsFailure(
                error instanceof RpcError ? error.message : 'Unknown error'
              )))
            ));
          });
          return merge(...actions);
        }),
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
        withLatestFrom(state$),
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

export const retrieveGatewaysEpic = (action$, state$, { adsRpc }) => action$.pipe(
  ofType(ADS_WALLET_INIT),
  withLatestFrom(state$),
  switchMap(() => from(adsRpc.getGateways())
    .pipe(
      mergeMap(gateways => of(retrieveGatewaysDataSuccess(gateways))),
      catchError(error => of(retrieveGatewaysDataFailure(
        error instanceof RpcError ? error.message : 'Unknown error'
      )))
    )
  )
);

