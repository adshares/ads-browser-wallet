export const OPEN_AUTHORISATION_DIALOG = 'OPEN_AUTHORISATION_DIALOG';

export const toggleAuthorisationDialog = (pageName, isOpen) => ({
  type: OPEN_AUTHORISATION_DIALOG,
  isOpen,
  pageName
});
