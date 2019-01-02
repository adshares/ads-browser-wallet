import { of, from, empty } from 'rxjs';
import { ofType } from 'redux-observable';
import { mergeMap, mapTo, switchMap, take, withLatestFrom, filter } from 'rxjs/operators';
import * as vaultActions from '../actions/vaultActions';
import {
  PASS_INPUT_VALIDATION_SUCCESS,
  formClean,
  TOGGLE_AUTHORISATION_DIALOG, toggleAuthorisationDialog, passwordChange
} from '../actions/form';
import { validatePagesBranch, getReferrer } from './helpers';

// TODO redirect to previous pages
export const cleanForm = action$ => action$.pipe(
  ofType(PASS_INPUT_VALIDATION_SUCCESS),
  switchMap(action => action$.pipe(
    ofType(vaultActions.IMPORT_KEY, vaultActions.ADD_ACCOUNT, vaultActions.UPDATE_ACCOUNT),
    take(1),
    mapTo(formClean(action.pageName))
    )
  )
);

export const addAccountEpic = (action$, state$, { history }) => action$.pipe(
  ofType(PASS_INPUT_VALIDATION_SUCCESS),
  withLatestFrom(state$),
  switchMap(([action, state]) => action$.pipe(
    ofType(vaultActions.ADD_ACCOUNT_INIT),
    take(1),
    mergeMap(() => {
      const { pageName } = action;
      const { pages, vault: { selectedAccount } } = state;
      validatePagesBranch(pages, pageName);
      const { auth, inputs, publicKey } = pages[pageName];
      history.push(getReferrer(history, '/settings'));

      return from(
        [vaultActions.addAccount({
          address: inputs.address.value,
          name: inputs.name.value,
          publicKey,
          password: auth.password.value,
        }), !selectedAccount ? vaultActions.selectActiveAccount(inputs.address.value) :
          empty()]
      );
    })
    )
  )
);

export const redirectionFormEpic = (action$, state$, { history }) => action$.pipe(
  ofType(TOGGLE_AUTHORISATION_DIALOG),
  filter(action => action.isOpen === true),
  switchMap(action => action$.pipe(
    ofType('@@router/LOCATION_CHANGE'),
    take(1),
    withLatestFrom(state$),
    mergeMap(() => {
      const { pageName } = action;
      history.push(getReferrer(history, '/settings'));

      return from([
        toggleAuthorisationDialog(pageName, false),
      ]);
    })
    ),
  )
);

export const updateAccountEpic = (action$, state$, { history }) => action$.pipe(
  ofType(PASS_INPUT_VALIDATION_SUCCESS),
  withLatestFrom(state$),
  switchMap(([action, state]) => action$.pipe(
    ofType(vaultActions.UPDATE_ACCOUNT_INIT),
    take(1),
    mergeMap(() => {
      const { pageName } = action;
      const { pages } = state;

      validatePagesBranch(pages, pageName);
      const { auth, inputs } = pages[pageName];
      history.push(getReferrer(history, '/settings'));

      return of(
        vaultActions.updateAccount({
          address: inputs.address.value,
          name: inputs.name.value,
          publicKey: inputs.publicKey.value,
          password: auth.password.value
        })
      );
    })
    )
  )
);

export const importKeysEpic = (action$, state$, { history }) => action$.pipe(
  ofType(PASS_INPUT_VALIDATION_SUCCESS),
  withLatestFrom(state$),
  switchMap(([action, state]) => action$.pipe(
    ofType(vaultActions.IMPORT_KEY_INIT),
    take(1),
    mergeMap(() => {
      const { pageName } = action;
      const { pages } = state;

      validatePagesBranch(pages, pageName);
      const { auth, inputs } = pages[pageName];
      history.push(getReferrer(history, '/keys'));

      return of(
        vaultActions.importKey({
          secretKey: inputs.secretKey.value,
          name: inputs.name.value,
          publicKey: inputs.publicKey.value,
          password: auth.password.value
        })
      );
    })
    )
  )
);
