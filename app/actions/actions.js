export const TOGGLE_AUTHORISATION_DIALOG = 'TOGGLE_AUTHORISATION_DIALOG';

export const toggleAuthorisationDialog = (pageName, isOpen) => ({
  type: TOGGLE_AUTHORISATION_DIALOG,
  isOpen,
  pageName
});
