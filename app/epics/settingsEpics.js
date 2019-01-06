import { from, of, concat } from 'rxjs';
import { ofType } from 'redux-observable';
import { mergeMap, withLatestFrom, switchMap, map, filter, take } from 'rxjs/operators';
import BgClient from '../utils/background';
import * as SA from '../actions/settingsActions';
import * as VA from '../actions/vaultActions';
import {
  FORM_VALIDATION_SUCCESS,
  validateForm,
} from '../actions/formActions';
import {
  PASSWORD_CONFIRMED,
  CLOSE_DIALOG as CLOSE_AUTH_DIALOG,
  openDialog as openAuthDialog
} from '../actions/authDialogActions';
import { getReferrer } from './helpers';

export const secretDataAccessEpic = (action$, state$, { history }) => action$.pipe(
  ofType(SA.SECRET_DATA_ACCESS),
  switchMap(initAction => concat(
    of(openAuthDialog(initAction.name)),
    action$.pipe(
      ofType(PASSWORD_CONFIRMED, CLOSE_AUTH_DIALOG),
      take(1),
      map((action) => {
        if (action.type === CLOSE_AUTH_DIALOG) {
          history.push(getReferrer(history, '/settings'));
          return SA.secretDataAccessDenied(action.name);
        }
        return SA.secretDataAccessGranted(action.name);
      })
    )
  ))
);

export const eraseStorageEpic = action$ => action$.pipe(
  ofType(SA.ERASE_STORAGE),
  switchMap(() => concat(
    of(openAuthDialog(SA.ERASE_STORAGE)),
    action$.pipe(
      ofType(PASSWORD_CONFIRMED, CLOSE_AUTH_DIALOG),
      take(1),
      mergeMap((action) => {
        if (action.type === CLOSE_AUTH_DIALOG || action.name !== SA.ERASE_STORAGE) {
          return of(SA.eraseStorageFailure('Access denied'));
        }

        BgClient.removeSession();

        let resolve;
        const promise = new Promise((res) => { resolve = res; })
          .then(() => SA.eraseStorageSuccess())
          .catch(error => SA.passwordChangeFailure(error.message || 'Unknown error'));

        return concat(
          of(VA.erase(resolve)),
          from(promise),
        );
      })
    )
  ))
);

export const changePasswordEpic = (action$, state$) => action$.pipe(
  ofType(SA.CHANGE_PASSWORD),
  switchMap(() => concat(
    of(validateForm(SA.CHANGE_PASSWORD)),
    action$.pipe(
      ofType(FORM_VALIDATION_SUCCESS),
      filter(action => action.pageName === SA.CHANGE_PASSWORD),
      switchMap(() => concat(
        of(openAuthDialog(SA.CHANGE_PASSWORD)),
        action$.pipe(
          ofType(PASSWORD_CONFIRMED, CLOSE_AUTH_DIALOG),
          take(1),
          withLatestFrom(state$),
          mergeMap(([action, state]) => {
            if (action.type === CLOSE_AUTH_DIALOG || action.name !== SA.CHANGE_PASSWORD) {
              return of(SA.passwordChangeFailure(SA.CHANGE_PASSWORD, 'Access denied'));
            }

            let resolve;
            const promise = new Promise((res) => { resolve = res; })
              .then(() => SA.passwordChangeSuccess(SA.CHANGE_PASSWORD))
              .catch(error => SA.passwordChangeFailure(SA.CHANGE_PASSWORD, error.message || 'Unknown error'));

            const { pages: { [SA.CHANGE_PASSWORD]: { inputs } } } = state;
            return concat(
              of(VA.changePassword(inputs.newPassword.value, resolve)),
              from(promise),
            );
          })
        )
      ))
    )
  ))
);

export const generateKeysEpic = action$ => action$.pipe(
  ofType(SA.GENERATE_KEYS),
  switchMap(initAction => concat(
    of(openAuthDialog(SA.GENERATE_KEYS)),
    action$.pipe(
      ofType(PASSWORD_CONFIRMED, CLOSE_AUTH_DIALOG),
      take(1),
      mergeMap((action) => {
        if (action.type === CLOSE_AUTH_DIALOG || action.name !== SA.GENERATE_KEYS) {
          return of(SA.generateKeysFailure('Access denied'));
        }

        let resolve;
        const promise = new Promise((res) => { resolve = res; })
          .then(() => SA.generateKeysSuccess())
          .catch(error => SA.generateKeysFailure(error.message || 'Unknown error'));

        return concat(
          of(VA.generateKeys(initAction.quantity, action.password, resolve)),
          from(promise),
        );
      })
    )
  ))
);

export const saveKeyEpic = (action$, state$, { history }) => action$.pipe(
  ofType(SA.SAVE_KEY),
  switchMap(() => concat(
    of(validateForm(SA.SAVE_KEY)),
    action$.pipe(
      ofType(FORM_VALIDATION_SUCCESS),
      filter(action => action.pageName === SA.SAVE_KEY),
      switchMap(() => concat(
        of(openAuthDialog(SA.SAVE_KEY)),
        action$.pipe(
          ofType(PASSWORD_CONFIRMED, CLOSE_AUTH_DIALOG),
          take(1),
          withLatestFrom(state$),
          mergeMap(([action, state]) => {
            if (action.type === CLOSE_AUTH_DIALOG || action.name !== SA.SAVE_KEY) {
              return of(SA.saveKeyFailure(SA.SAVE_KEY, 'Access denied'));
            }

            let resolve;
            const promise = new Promise((res) => { resolve = res; })
              .then(() => {
                history.push(getReferrer(history, '/settings'));
                return SA.saveKeySuccess(SA.SAVE_KEY);
              })
              .catch(error => SA.saveKeyFailure(SA.SAVE_KEY, error.message || 'Unknown error'));

            const { pages: { [SA.SAVE_KEY]: { inputs } } } = state;
            const name = inputs.name.value;
            const secretKey = inputs.secretKey.value;
            return concat(
              of(VA.addKey(name, secretKey, action.password, resolve)),
              from(promise),
            );
          })
        )
      ))
    )
  ))
);

export const removeKeyEpic = action$ => action$.pipe(
  ofType(SA.REMOVE_KEY),
  switchMap(initAction => concat(
    of(openAuthDialog(SA.REMOVE_KEY)),
    action$.pipe(
      ofType(PASSWORD_CONFIRMED, CLOSE_AUTH_DIALOG),
      take(1),
      mergeMap((action) => {
        if (action.type === CLOSE_AUTH_DIALOG || action.name !== SA.REMOVE_KEY) {
          return of(SA.removeKeyFailure(initAction.publicKey, 'Access denied'));
        }

        let resolve;
        const promise = new Promise((res) => { resolve = res; })
          .then(() => SA.removeKeySuccess(initAction.publicKey))
          .catch(error => SA.removeKeyFailure(initAction.publicKey, error.message || 'Unknown error'));

        return concat(
          of(VA.removeKey(initAction.publicKey, action.password, resolve)),
          from(promise),
        );
      })
    )
  ))
);
