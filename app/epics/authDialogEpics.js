import { Observable } from 'rxjs';
import { ofType } from 'redux-observable';
import { mergeMap, mapTo, switchMap, take } from 'rxjs/operators';

import * as vaultActions from '../actions/vault';
import { PASS_INPUT_VALIDATION_SUCCESS, formClean } from '../actions/form';
import { validatePagesBranch } from './helpers';

export const cleanForm = (action$) => action$.pipe(
    ofType(PASS_INPUT_VALIDATION_SUCCESS),
    switchMap(action => action$.pipe(
        ofType(vaultActions.IMPORT_KEY, vaultActions.ADD_ACCOUNT),
        take(1),
        mapTo(formClean(action.pageName))
    )
    )
);

export const addAccountEpic = (action$, store) => action$.pipe(
    ofType(PASS_INPUT_VALIDATION_SUCCESS),
    switchMap(action => action$.pipe(
        ofType(vaultActions.ADD_ACCOUNT_INIT),
        take(1),
        mergeMap(() => {
          const { pageName } = action;
          const { pages } = store.getState();

          validatePagesBranch(pages, pageName);
          const { auth, inputs } = pages[pageName];
          return Observable.of(vaultActions.addAccount({
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

export const updateAccountEpic = (action$, store) => action$.pipe(
    ofType(PASS_INPUT_VALIDATION_SUCCESS),
    switchMap(action => action$.pipe(
        ofType(vaultActions.UPDATE_ACCOUNT_INIT),
        take(1),
        mergeMap(() => {
          const { pageName } = action;
          const { pages } = store.getState();

          validatePagesBranch(pages, pageName);
          const { auth, inputs } = pages[pageName];
          return Observable.of(vaultActions.updateAccount({
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

export const importKeysEpic = (action$, store) => action$.pipe(
    ofType(PASS_INPUT_VALIDATION_SUCCESS),
    switchMap(action => action$.pipe(
        ofType(vaultActions.IMPORT_KEY_INIT),
        take(1),
        mergeMap(() => {
          const { pageName } = action;
          const { pages } = store.getState();

          validatePagesBranch(pages, pageName);
          const { auth, inputs } = pages[pageName];
          return Observable.of(vaultActions.importKey({
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
