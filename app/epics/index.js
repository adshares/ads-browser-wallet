import { combineEpics } from 'redux-observable';
import validateForm from './validateForm';
import validatePassword from './validatePassword';
import { addAccountEpic, importKeysEpic, cleanForm, updateAccountEpic } from './authDialogEpics';
import accountEditValidateForm from './accountEditValidateForm';
import editAccountEpic from './editAccountEpic';

export default combineEpics(
    validateForm,
    accountEditValidateForm,
    validatePassword,
    addAccountEpic,
    importKeysEpic,
    cleanForm,
    updateAccountEpic,
  editAccountEpic,
);
