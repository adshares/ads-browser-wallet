import { combineEpics } from 'redux-observable';
import validateForm from './validateForm';
import validatePassword from './validatePassword';
import {
  addAccountEpic,
  importKeysEpic,
  cleanForm,
  updateAccountEpic,
} from './authDialogEpics';
import {
  removeKeyEpic, removeAccountEpic, saveGeneratedKeysEpic, cleanGlobalAuthDialog,
} from './globalAuthDialogEpics';
import accountEditValidateForm from './accountEditValidateForm';
import editAccountEpic from './editAccountEpic';
import validateGlobalPassword from './validateGlobalPassword';

export default combineEpics(
  validateForm,
  accountEditValidateForm,
  validatePassword,
  validateGlobalPassword,
  addAccountEpic,
  importKeysEpic,
  cleanForm,
  updateAccountEpic,
  editAccountEpic,
  removeKeyEpic,
  removeAccountEpic,
  saveGeneratedKeysEpic,
  cleanGlobalAuthDialog,
);
