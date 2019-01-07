import { from, of, concat } from 'rxjs';
import { ofType } from 'redux-observable';
import { mergeMap, withLatestFrom, switchMap, map, filter, take } from 'rxjs/operators';
import BgClient from '../utils/background';
import * as SA from '../actions/settingsActions';
import * as VA from '../actions/vaultActions';
import {
  FORM_VALIDATION_SUCCESS, INPUT_CHANGED,
  validateForm,
} from '../actions/formActions'
import {
  PASSWORD_CONFIRMED,
  PASSWORD_REJECTED,
  openDialog as openAuthDialog
} from '../actions/authDialogActions';
import { getReferrer } from './helpers';
import { RpcError } from '../actions/errors'
import { importAccountPublicKey } from '../actions/settingsActions'
import { importAccountPublicKeySuccess } from '../actions/settingsActions'
import { publicKey as validatePublicKey } from '../utils/validators'
import { catchError } from 'rxjs/operators/index'
import { importAccountPublicKeyFailure } from '../actions/settingsActions'
import AccountEditorPage from '../containers/Settings/AccountEditorPage'
import { validateAddress } from '../utils/ads'

export const secretDataAccessEpic = (action$, state$, { history }) => action$.pipe(
  ofType(SA.SECRET_DATA_ACCESS),
  switchMap(initAction => concat(
    of(openAuthDialog(initAction.name)),
    action$.pipe(
      ofType(PASSWORD_CONFIRMED, PASSWORD_REJECTED),
      take(1),
      filter(action => action.name === initAction.name),
      map((action) => {
        if (action.type === PASSWORD_REJECTED) {
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
      ofType(PASSWORD_CONFIRMED, PASSWORD_REJECTED),
      take(1),
      filter(action => action.name === SA.ERASE_STORAGE),
      mergeMap((action) => {
        if (action.type === PASSWORD_REJECTED) {
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
          ofType(PASSWORD_CONFIRMED, PASSWORD_REJECTED),
          take(1),
          filter(action => action.name === SA.CHANGE_PASSWORD),
          withLatestFrom(state$),
          mergeMap(([action, state]) => {
            if (action.type === PASSWORD_REJECTED) {
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
      ofType(PASSWORD_CONFIRMED, PASSWORD_REJECTED),
      take(1),
      filter(action => action.name === SA.GENERATE_KEYS),
      mergeMap((action) => {
        if (action.type === PASSWORD_REJECTED) {
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
          ofType(PASSWORD_CONFIRMED, PASSWORD_REJECTED),
          take(1),
          filter(action => action.name === SA.SAVE_KEY),
          withLatestFrom(state$),
          mergeMap(([action, state]) => {
            if (action.type === PASSWORD_REJECTED) {
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
              of(VA.saveKey(secretKey, name, action.password, resolve)),
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
      ofType(PASSWORD_CONFIRMED, PASSWORD_REJECTED),
      take(1),
      filter(action => action.name === SA.REMOVE_KEY),
      mergeMap((action) => {
        if (action.type === PASSWORD_REJECTED) {
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

export const importAccountPublicKeyEpic = (action$, state$, { adsRpc }) => action$.pipe(
  ofType(INPUT_CHANGED),
  filter(action =>
    action.pageName === SA.SAVE_ACCOUNT &&
    action.inputName === 'address' &&
    validateAddress(action.inputValue)
  ),
  withLatestFrom(state$),
  mergeMap(([action, state]) => concat(
    of(importAccountPublicKey(action.pageName, action.inputValue)),
    from(adsRpc.getAccount(action.inputValue)).pipe(
      mergeMap((account) => {
        const { vault } = state;
        const errorMsg = validatePublicKey({
          vault,
          value: account.publicKey,
          pageName: action.pageName
        });
        if (errorMsg) {
          return of(importAccountPublicKeyFailure(
            action.pageName,
            errorMsg,
            account.publicKey
          ));
        }
        return of(importAccountPublicKeySuccess(
          action.pageName,
          account.publicKey
        ));
      }),
      catchError(error => of(importAccountPublicKeyFailure(
        action.pageName,
        error instanceof RpcError ? error.message : 'Unknown error'
      )))
    )
  )),
);

export const saveAccountEpic = (action$, state$, { history }) => action$.pipe(
  ofType(SA.SAVE_ACCOUNT),
  switchMap(() => concat(
    of(validateForm(SA.SAVE_ACCOUNT)),
    action$.pipe(
      ofType(FORM_VALIDATION_SUCCESS),
      filter(action => action.pageName === SA.SAVE_ACCOUNT),
      switchMap(() => concat(
        of(openAuthDialog(SA.SAVE_ACCOUNT)),
        action$.pipe(
          ofType(PASSWORD_CONFIRMED, PASSWORD_REJECTED),
          take(1),
          filter(action => action.name === SA.SAVE_ACCOUNT),
          withLatestFrom(state$),
          mergeMap(([action, state]) => {
            if (action.type === PASSWORD_REJECTED) {
              return of(SA.saveAccountFailure(SA.SAVE_ACCOUNT, 'Access denied'));
            }

            let resolve;
            const promise = new Promise((res) => { resolve = res; })
              .then(() => {
                history.push(getReferrer(history, '/settings'));
                return SA.saveAccountSuccess(SA.SAVE_ACCOUNT);
              })
              .catch(error => SA.saveAccountFailure(SA.SAVE_ACCOUNT, error.message || 'Unknown error'));

            const { pages: { [SA.SAVE_ACCOUNT]: { inputs } } } = state;
            const name = inputs.name.value;
            const address = inputs.address.value;
            return concat(
              of(VA.saveAccount(address, name, action.password, resolve)),
              from(promise),
            );
          })
        )
      ))
    )
  ))
);

export const removeAccountEpic = action$ => action$.pipe(
  ofType(SA.REMOVE_ACCOUNT),
  switchMap(initAction => concat(
    of(openAuthDialog(SA.REMOVE_ACCOUNT)),
    action$.pipe(
      ofType(PASSWORD_CONFIRMED, PASSWORD_REJECTED),
      take(1),
      filter(action => action.name === SA.REMOVE_ACCOUNT),
      mergeMap((action) => {
        if (action.type === PASSWORD_REJECTED) {
          return of(SA.removeAccountFailure(initAction.address, 'Access denied'));
        }

        let resolve;
        const promise = new Promise((res) => { resolve = res; })
          .then(() => SA.removeAccountSuccess(initAction.address))
          .catch(error => SA.removeAccountFailure(initAction.address, error.message || 'Unknown error'));

        return concat(
          of(VA.removeAccount(initAction.address, action.password, resolve)),
          from(promise),
        );
      })
    )
  ))
);
