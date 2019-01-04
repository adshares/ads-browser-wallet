/* eslint-disable import/prefer-default-export */
import { from, of, concat, merge } from 'rxjs';
import { ofType } from 'redux-observable';
import { mergeMap, withLatestFrom, map } from 'rxjs/operators';
import * as settingsActions from '../actions/settingsActions';
import * as vaultActions from '../actions/vaultActions';
import {
  FORM_VALIDATION_SUCCESS
} from '../actions/form';

export const changePasswordEpic = (action$, state$) => action$.pipe(
  ofType(FORM_VALIDATION_SUCCESS),
  mergeMap(() => merge(
    action$.pipe(
      ofType(settingsActions.SETTINGS_CHANGE_PASSWORD_INIT),
      map(action => settingsActions.changePassword(action.pageName))
    ),
    action$.pipe(
      ofType(settingsActions.SETTINGS_CHANGE_PASSWORD),
      withLatestFrom(state$),
      mergeMap(([action, state]) => {
        const { pages: { SettingsPage: { inputs } } } = state;
        let resolve;
        const promise = new Promise((res) => {
          resolve = res;
        }).then(data => (data.error ?
          settingsActions.passwordChangeFailure(action.pageName, data.error.message || 'Unknown error') :
          settingsActions.passwordChangeSuccess(action.pageName)
        )).catch(error => settingsActions.passwordChangeFailure(error.message || 'Unknown error'));

        return concat(
          of(vaultActions.changePassword(inputs.newPassword.value, resolve)),
          from(promise),
        );
      })
    ),
  ))
);
