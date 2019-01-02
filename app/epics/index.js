import { combineEpics } from 'redux-observable';
import validateForm from './validateForm';
import validatePassword from './validatePassword';
import {
  addAccountEpic,
  importKeysEpic,
  cleanForm,
  updateAccountEpic,
  redirectionFormEpic
} from './authDialogEpics';
import {
  removeKeyEpic,
  removeAccountEpic,
  saveGeneratedKeysEpic,
  cleanGlobalAuthDialog,
  eraseStorageEpic,
  previewSecretDataEpic,
  redirectionEpic,
  removeAccessRightsForProtectedDataEpic,
} from './globalAuthDialogEpics';
import accountEditValidateForm from './accountEditValidateForm';
import editAccountEpic from './editAccountEpic';
import validateGlobalPassword from './validateGlobalPassword';
import {
  retrieveAccountEpic,
  retrieveNodesEpic
} from './retrieveDataEpics';
import unsealEpic from './unsealEpic';
import {
  validateTransactionFormEpic,
  sendTransactionEpic
} from './transactionEpics';
import { changePasswordEpic } from './settingsEpics';

export default combineEpics(
  validateForm,
  accountEditValidateForm,
  validatePassword,
  validateGlobalPassword,
  addAccountEpic,
  importKeysEpic,
  cleanForm,
  changePasswordEpic,
  updateAccountEpic,
  editAccountEpic,
  removeKeyEpic,
  removeAccountEpic,
  saveGeneratedKeysEpic,
  eraseStorageEpic,
  cleanGlobalAuthDialog,
  retrieveAccountEpic,
  retrieveNodesEpic,
  unsealEpic,
  previewSecretDataEpic,
  redirectionEpic,
  redirectionFormEpic,
  validateTransactionFormEpic,
  sendTransactionEpic,
  removeAccessRightsForProtectedDataEpic
);
