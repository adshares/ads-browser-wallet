import {
  filter, map,
  mergeMap, switchMap,
  takeUntil,
  tap, withLatestFrom,
} from 'rxjs/operators';
import {
  RETRIEVE_ACCOUNT_DATA_IN_INTERVALS,
  RETRIEVE_NODES_DATA_IN_INTERVALS,
} from '../actions/walletActions';
import { of, timer } from 'rxjs';
import { seal } from '../actions/vaultActions';

export const autoLogoutEpic = (action$, state$)=> action$.pipe(
  withLatestFrom(state$),
  filter(([action, state]) => {
    console.log('COP1', state.vault.sealed)
    return (!state.vault.sealed && action.type !== RETRIEVE_NODES_DATA_IN_INTERVALS) &&
      (action.type !== RETRIEVE_ACCOUNT_DATA_IN_INTERVALS);
  }),
  mergeMap(() =>
    timer(0, 30000)
      .pipe(
        switchMap(() => of(seal())),
        takeUntil(action$.pipe(
          filter(action => {
            console.log('COP2')
            return (action.type !== RETRIEVE_NODES_DATA_IN_INTERVALS) &&
              (action.type !== RETRIEVE_ACCOUNT_DATA_IN_INTERVALS);
          }),
          )
        ),
      ),
  )
);

