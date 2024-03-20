import { from, of, concat, forkJoin } from 'rxjs';
import { ofType } from 'redux-observable';
import { mergeMap, withLatestFrom, switchMap, map, filter, take, catchError } from 'rxjs/operators';
import BgClient from '../utils/background';
import { RpcError } from '../actions/errors';
import ADS from '../utils/ads';
import { findKeyIndex } from '../utils/keybox';
import { publicKey as validatePublicKey } from '../utils/validators';
import * as SA from '../actions/settingsActions';
import * as VA from '../actions/vaultActions';
import {
  FORM_VALIDATION_SUCCESS,
  INPUT_CHANGED,
  validateForm,
} from '../actions/formActions';
import {
  PASSWORD_CONFIRMED,
  PASSWORD_REJECTED,
  openDialog as openAuthDialog
} from '../actions/authDialogActions';
import { getReferrer } from './helpers';
import config from '../config/config';

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
  mergeMap((action) => {
    let resolve;
    const promise = new Promise((res) => { resolve = res; })
      .then(() => SA.generateKeysSuccess())
      .catch(error => SA.generateKeysFailure(error.message || 'Unknown error'));

    return concat(
      of(VA.generateKeys(action.quantity, resolve)),
      from(promise),
    );
  })
);

export const saveKeyEpic = (action$, state$, { history }) => action$.pipe(
  ofType(SA.SAVE_KEY),
  switchMap(initAction => concat(
    of(validateForm(SA.SAVE_KEY, initAction.editedId)),
    action$.pipe(
      ofType(FORM_VALIDATION_SUCCESS),
      filter(action => action.pageName === SA.SAVE_KEY),
      withLatestFrom(state$),
      mergeMap(([, state]) => {
        let resolve;
        const promise = new Promise((res) => { resolve = res; })
          .then((key) => {
            history.push(getReferrer(history, '/settings'));
            return SA.saveKeySuccess(key, initAction.editedId);
          })
          .catch(error => SA.saveKeyFailure(SA.SAVE_KEY, initAction.editedId, error.message || 'Unknown error'));

        const { pages: { [SA.SAVE_KEY]: { inputs } } } = state;
        const name = inputs.name.value.trim();
        const secretKey = inputs.secretKey.value.trim();
        return concat(
          of(VA.saveKey(secretKey, name, resolve)),
          from(promise),
        );
      })
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
          of(VA.removeKey(initAction.publicKey, resolve)),
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
    ADS.validateAddress(action.inputValue)
  ),
  withLatestFrom(state$),
  mergeMap(([action, state]) => concat(
    of(SA.importAccountPublicKey(action.pageName, action.inputValue)),
    from(adsRpc.getAccount(action.inputValue)).pipe(
      mergeMap((account) => {
        const { vault } = state;
        const errorMsg = validatePublicKey({
          vault,
          value: account.publicKey,
          pageName: action.pageName
        });
        if (errorMsg) {
          return of(SA.importAccountPublicKeyFailure(
            action.pageName,
            errorMsg,
            account.publicKey
          ));
        }
        return of(SA.importAccountPublicKeySuccess(
          action.pageName,
          account.publicKey
        ));
      }),
      catchError(error => of(SA.importAccountPublicKeyFailure(
        action.pageName,
        error instanceof RpcError ? error.message : 'Unknown error'
      )))
    )
  )),
);

export const saveAccountEpic = (action$, state$, { history }) => action$.pipe(
  ofType(SA.SAVE_ACCOUNT),
  switchMap(initAction => concat(
    of(validateForm(SA.SAVE_ACCOUNT, initAction.editedId)),
    action$.pipe(
      ofType(FORM_VALIDATION_SUCCESS),
      filter(action => action.pageName === SA.SAVE_ACCOUNT),
      withLatestFrom(state$),
      mergeMap(([, state]) => {
        let resolve;
        const promise = new Promise((res) => { resolve = res; })
          .then((account) => {
            history.push(getReferrer(history, '/settings'));
            return SA.saveAccountSuccess(account, initAction.editedId);
          })
          .catch(error => SA.saveAccountFailure(SA.SAVE_ACCOUNT, initAction.editedId, error.message || 'Unknown error'));

        const { vault, pages: { [SA.SAVE_ACCOUNT]: { publicKey, inputs } } } = state;
        const name = inputs.name.value.trim();
        const address = inputs.address.value.trim();
        const keyIndex = findKeyIndex(vault.seed, publicKey);

        const actions = [];
        if (keyIndex >= vault.keyCount) {
          actions.push(of(VA.generateKeys((keyIndex - vault.keyCount) + 1)));
        }
        actions.push(of(VA.saveAccount(address, name, resolve)));
        actions.push(from(promise));
        actions.push(action$.pipe(
          ofType(SA.SAVE_ACCOUNT_SUCCESS, SA.SAVE_KEY_FAILURE),
          take(1),
          filter(a => a.type === SA.SAVE_ACCOUNT_SUCCESS && !!a.editedId),
          map(a => VA.selectActiveAccount(a.editedId))
        ));

        return concat(...actions);
      })
    )
  ))
);

export const selectAccountAfterSaveEpic = action$ => action$.pipe(
  ofType(SA.SAVE_ACCOUNT_SUCCESS),
  filter(action => !action.editedId),
  map(action => VA.selectActiveAccount(action.account.address))
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
          of(VA.removeAccount(initAction.address, resolve)),
          from(promise),
        );
      })
    )
  ))
);

export const createFreeAccountEpic = (action$, state$, { adsRpc }) => action$.pipe(
  ofType(SA.CREATE_FREE_ACCOUNT),
  withLatestFrom(state$),
  mergeMap(([, state]) => {
    const { vault } = state;
    const key = vault.keys.filter(k => k.type === 'auto')[0];
    const confirm = ADS.sign('', key.publicKey, key.secretKey);

    return from(adsRpc.createFreeAccount(key.publicKey, confirm)).pipe(
      mergeMap((address) => {
        let resolve;
        const promise = new Promise((res) => { resolve = res; })
          .then(account => SA.createFreeAccountSuccess(account))
          .catch(error => SA.createFreeAccountFailure(error.message || 'Unknown error'));

        return concat(
          of(VA.saveAccount(address, config.testnet ? 'Test account' : 'My account', resolve)),
          from(promise),
          of(VA.selectActiveAccount(address))
        );
      }),
      catchError(error => of(SA.createFreeAccountFailure(
        error instanceof RpcError ? error.message : 'Unknown error'
      )))
    );
  })
);

export const findAccountsEpic = (action$, state$, { adsRpc }) => action$.pipe(
  ofType(SA.FIND_ALL_ACCOUNTS),
  withLatestFrom(state$),
  mergeMap(([, state]) => {
    const { vault } = state;
    const keys = vault.keys.map(key => from(adsRpc.findAccounts(key.publicKey)));
    return forkJoin([...keys]).pipe(
      mergeMap((data) => {
        let count = 0;
        const actions = [];
        data.forEach((accounts) => {
          count += accounts.length;
          accounts.forEach((account) => {
            if (!vault.accounts.some(a => a.address === account.address)) {
              actions.push(of(VA.saveAccount(account.address, '')));
              actions.push(of(VA.selectActiveAccount(account.address)));
            }
          });
        });
        return concat(...actions, of(SA.findAllAccountsSuccess(count)));
      }),
      catchError(error => of(SA.findAllAccountsFailure(
        error instanceof RpcError ? error.message : 'Unknown error'
      )))
    );
  })
);

export const refreshAccountsEpic = action$ => action$.pipe(
  ofType(VA.CREATE, VA.GENERATE_KEYS, VA.SAVE_KEY),
  map(() => SA.findAllAccounts())
);
