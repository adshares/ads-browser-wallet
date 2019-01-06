import { ofType } from 'redux-observable';
import { map, switchMap, take, withLatestFrom } from 'rxjs/operators';
import { password as validatePassword } from '../utils/validators';
import {
  OPEN_DIALOG,
  CONFIRM_PASSWORD,
  passwordConfirmed,
  passwordRejected,
  resetDialog,
} from '../actions/authDialogActions';

export const openDialogEpic = action$ => action$.pipe(
  ofType(OPEN_DIALOG),
  switchMap(() => action$.pipe(
    ofType('@@router/LOCATION_CHANGE'),
    take(1),
    map(() => resetDialog())
  ))
);

export const confirmPasswordEpic = (action$, state$) => action$.pipe(
  ofType(CONFIRM_PASSWORD),
  withLatestFrom(state$),
  map(([action, state]) => {
    const { vault } = state;
    const errorMsg = validatePassword({ value: action.password, vault });
    return errorMsg === null ?
      passwordConfirmed(action.name, action.password) :
      passwordRejected(action.name, errorMsg);
  })
);

// export const cleanForm = action$ => action$.pipe(
//   ofType(PASS_INPUT_VALIDATION_SUCCESS),
//   switchMap(action => action$.pipe(
//     ofType(vaultActions.SAVE_KEY, vaultActions.ADD_ACCOUNT, vaultActions.UPDATE_ACCOUNT),
//     take(1),
//     mapTo(cleanForm(action.pageName))
//     )
//   )
// );
//
// export const addAccountEpic = (action$, state$, { history }) => action$.pipe(
//   ofType(PASS_INPUT_VALIDATION_SUCCESS),
//   withLatestFrom(state$),
//   switchMap(([action, state]) => action$.pipe(
//     ofType(vaultActions.ADD_ACCOUNT_INIT),
//     take(1),
//     mergeMap(() => {
//       const { pageName } = action;
//       const { pages } = state;
//
//       validatePagesBranch(pages, pageName);
//       const { auth, inputs } = pages[pageName];
//       history.push(getReferrer(history, '/settings'));
//
//       return from([
//         vaultActions.addAccount({
//           address: inputs.address.value,
//           name: inputs.name.value,
//           password: auth.password.value,
//         }),
//         vaultActions.selectActiveAccount(inputs.address.value)
//       ]);
//     })
//   ))
// );
//
// export const updateAccountEpic = (action$, state$, { history }) => action$.pipe(
//   ofType(PASS_INPUT_VALIDATION_SUCCESS),
//   withLatestFrom(state$),
//   switchMap(([action, state]) => action$.pipe(
//     ofType(vaultActions.UPDATE_ACCOUNT_INIT),
//     take(1),
//     map(() => {
//       const { pageName } = action;
//       const { pages } = state;
//
//       validatePagesBranch(pages, pageName);
//       const { auth, inputs } = pages[pageName];
//       history.push(getReferrer(history, '/settings'));
//
//       return vaultActions.updateAccount({
//         address: inputs.address.value,
//         name: inputs.name.value,
//         password: auth.password.value
//       });
//     })
//   ))
// );
//
// export const redirectionFormEpic = (action$, state$) => action$.pipe(
//   ofType(TOGGLE_AUTHORISATION_DIALOG),
//   filter(action => action.isOpen === true),
//   switchMap(action => action$.pipe(
//     ofType('@@router/LOCATION_CHANGE'),
//     take(1),
//     withLatestFrom(state$),
//     mergeMap(() => {
//       const { pageName } = action;
//       // history.push(getReferrer(history, '/settings'));
//
//       return from([
//         toggleAuthorisationDialog(pageName, false),
//       ]);
//     })
//     ),
//   )
// );
//
// export const importKeysEpic = (action$, state$, { history }) => action$.pipe(
//   ofType(PASS_INPUT_VALIDATION_SUCCESS),
//   withLatestFrom(state$),
//   switchMap(([action, state]) => action$.pipe(
//     ofType(vaultActions.IMPORT_KEY_INIT),
//     take(1),
//     mergeMap(() => {
//       const { pageName } = action;
//       const { pages } = state;
//
//       validatePagesBranch(pages, pageName);
//       const { auth, inputs } = pages[pageName];
//       history.push(getReferrer(history, '/keys'));
//
//       return of(
//         vaultActions.saveKey({
//           secretKey: inputs.secretKey.value,
//           name: inputs.name.value,
//           publicKey: inputs.publicKey.value,
//           password: auth.password.value
//         })
//       );
//     })
//     )
//   )
// );
