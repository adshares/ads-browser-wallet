export const OPEN_DIALOG = 'AUTH_DIALOG_OPEN_DIALOG';
export const CLOSE_DIALOG = 'AUTH_DIALOG_CLOSE_DIALOG';
export const RESET_DIALOG = 'AUTH_DIALOG_RESET_DIALOG';
export const CONFIRM_PASSWORD = 'AUTH_DIALOG_CONFIRM_PASSWORD';
export const PASSWORD_CONFIRMED = 'AUTH_DIALOG_PASSWORD_CONFIRMED';
export const PASSWORD_REJECTED = 'AUTH_DIALOG_PASSWORD_REJECTED';

export const openDialog = name => ({
  type: OPEN_DIALOG,
  name
});

export const closeDialog = name => ({
  type: CLOSE_DIALOG,
  name
});

export const resetDialog = name => ({
  type: RESET_DIALOG,
  name
});

export const confirmPassword = (name, password) => ({
  type: CONFIRM_PASSWORD,
  name,
  password
});

export const passwordConfirmed = (name, password) => ({
  type: PASSWORD_CONFIRMED,
  name,
  password
});

export const passwordRejected = (name, errorMsg) => ({
  type: PASSWORD_REJECTED,
  name,
  errorMsg
});

