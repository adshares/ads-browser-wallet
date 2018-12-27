import {
  passInputValidateFailure,
  passInputValidateSuccess,
  formClean,
  toggleAuthorisationDialog
} from '../actions/form';
import * as vaultActions from '../actions/vault';
import * as validators from '../utils/validators';

export default function (pageName, vaultActionType) {
  return (dispatch, getState) => {

    const {vault, pages} = getState();

    if (!pages[pageName]) {
      throw new Error(`Page ${pageName} does not exist in store!`);
    }
    const {auth, inputs} = pages[pageName];

    const validator = validators.password;

    const actionsToDispatch = [];
    const errorMsg = validator({value: auth.password.value, vault});
    const isInputValid = errorMsg === null;

    if (isInputValid) {
      const callbackActionProps = Object.entries(inputs)
        .reduce(
          (acc, [inputName, inputProps]) => ({
            ...acc,
            [inputName]: inputProps.value
          }),
          {}
        );

      const actionName = vaultActionType
        .toLowerCase()
        .replace(/(\_\w)/g, m => m[1].toUpperCase());

      callbackActionProps.password = auth.password.value;
      const vaultAction = vaultActions[actionName];
      actionsToDispatch.concat([
        dispatch(passInputValidateSuccess(pageName, true)),
        dispatch(toggleAuthorisationDialog(pageName, false)),
        dispatch(vaultAction(callbackActionProps)),
        dispatch(formClean(pageName))
      ]);
    } else {
      actionsToDispatch.push(
        dispatch(passInputValidateFailure(pageName, errorMsg))
      ); // to prevent from sendingg
    }

    return Promise.all(actionsToDispatch);
  };
}
