import { ofType } from 'redux-observable';
import { of, from, concat } from 'rxjs'; // works for RxJS v6
import { mergeMap, filter, catchError, withLatestFrom } from 'rxjs/operators';
import AccountEditorPage from '../containers/Settings/AccountEditorPage';
import {
  importAccountPublicKey,
  importAccountPublicKeySuccess,
  importAccountPublicKeyFailure,
} from '../actions/settingsActions';
import {
  INPUT_CHANGED
} from '../actions/form';
import { validateAddress } from '../utils/ads';
import { RpcError } from '../actions/errors';
import { publicKey as validatePublicKey } from '../utils/validators';

export default (action$, state$, { adsRpc }) => action$.pipe(
    ofType(INPUT_CHANGED),
    filter(action =>
      action.pageName === AccountEditorPage.PAGE_NAME &&
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
