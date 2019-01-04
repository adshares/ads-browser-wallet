export const OPEN_DIALOG = 'AUTH_DIALOG_OPEN_DIALOG';
export const CLOSE_DIALOG = 'AUTH_DIALOG_CLOSE_DIALOG';
export const CONFIRM_PASSWORD = 'AUTH_DIALOG_CONFIRM_PASSWORD';
export const PASSWORD_CONFIRMED = 'AUTH_DIALOG_PASSWORD_CONFIRMED';
export const PASSWORD_REJECTED = 'AUTH_DIALOG_PASSWORD_REJECTED';

export const openDialog = uuid => ({
  type: OPEN_DIALOG,
  uuid
});

export const closeDialog = uuid => ({
  type: CLOSE_DIALOG,
  uuid
});

export const confirmPassword = (uuid, password) => ({
  type: PASSWORD_CONFIRMED,
  uuid,
  password
});

export const passwordConfirmed = uuid => ({
  type: PASSWORD_CONFIRMED,
  uuid
});

export const passwordRejected = uuid => ({
  type: PASSWORD_REJECTED,
  uuid
});

