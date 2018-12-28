export const CHANGE_PASSWORD_INIT = 'CHANGE_PASSWORD_INIT';
export const SAVE_CHANGED_PASSWORD = 'SAVE_CHANGED_PASSWORD';
export const SAVE_CHANGED_PASSWORD_SUCCESS = 'SAVE_CHANGED_PASSWORD_SUCCESS ';
export const SAVE_CHANGED_PASSWORD_FAILURE = 'SAVE_CHANGED_PASSWORD_FAILURE';

const changePasswordInit = (pageName, actionCallback) => ({
  type: CHANGE_PASSWORD_INIT,
  pageName,
  actionCallback,
});

const saveChangedPassword = (pageName, actionCallback) => ({
  type: SAVE_CHANGED_PASSWORD,
  pageName,
  actionCallback,
});

const saveChangedPasswordSuccess = (pageName) => ({
  type: SAVE_CHANGED_PASSWORD_SUCCESS,
  pageName
});

const saveChangedPasswordFailure = (pageName) => ({
  type: SAVE_CHANGED_PASSWORD_FAILURE,
  pageName
});

export {
  saveChangedPassword,
  changePasswordInit,
  saveChangedPasswordFailure,
  saveChangedPasswordSuccess
};
