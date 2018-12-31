import { ofType } from 'redux-observable';
import { of, from, timer } from 'rxjs';
import { mergeMap, catchError, switchMap, takeUntil, take } from 'rxjs/operators';
import { RpcError } from '../actions/errors';
import {
  ADS_WALLET_INIT,
  RETRIEVE_NODES_DATA_IN_INTERVALS,
  RETRIEVE_NODES_DATA_IN_INTERVALS_STOP,
  retrieveNodesDataInIntervalsSuccess,
  retrieveNodesDataInIntervalsFailure,
} from '../actions/actions';

export default (action$, state$, { adsRpc }) => action$.pipe(
  ofType(ADS_WALLET_INIT, RETRIEVE_NODES_DATA_IN_INTERVALS),
  take(1),
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
