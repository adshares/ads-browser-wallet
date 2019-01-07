import { ofType } from 'redux-observable';
import { map, switchMap, take, withLatestFrom } from 'rxjs/operators';
import { password as validatePassword } from '../utils/validators';
import {
  OPEN_DIALOG,
  CLOSE_DIALOG,
  CONFIRM_PASSWORD,
  passwordConfirmed,
  passwordRejected,
  invalidPassword,
  resetDialog,
} from '../actions/authDialogActions';

export const openDialogEpic = action$ => action$.pipe(
  ofType(OPEN_DIALOG),
  switchMap(action => action$.pipe(
    ofType('@@router/LOCATION_CHANGE'),
    take(1),
    map(() => resetDialog(action.name))
  ))
);

export const closeDialogEpic = action$ => action$.pipe(
  ofType(CLOSE_DIALOG),
  map(action => passwordRejected(action.name))
);

export const confirmPasswordEpic = (action$, state$) => action$.pipe(
  ofType(CONFIRM_PASSWORD),
  withLatestFrom(state$),
  map(([action, state]) => {
    const { vault } = state;
    const errorMsg = validatePassword({ value: action.password, vault });
    return errorMsg === null ?
      passwordConfirmed(action.name, action.password) :
      invalidPassword(action.name, errorMsg);
  })
);
