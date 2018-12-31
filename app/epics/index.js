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
  removeKeyEpic,
  removeAccountEpic,
  saveGeneratedKeysEpic,
  cleanGlobalAuthDialog,
  eraseStorageEpic,
} from './globalAuthDialogEpics';
import accountEditValidateForm from './accountEditValidateForm';
import editAccountEpic from './editAccountEpic';
import validateGlobalPassword from './validateGlobalPassword';
import {
  retrieveAccountEpic,
  retrieveNodesEpic
} from './retrieveDataEpics';
import unsealInit from './unsealEpic';
import {
  validateTransactionFormEpic,
  sendTransactionEpic
} from './transactionEpics';

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
  eraseStorageEpic,
  cleanGlobalAuthDialog,
  retrieveAccountEpic,
  retrieveNodesEpic,
  unsealInit,
  validateTransactionFormEpic,
  sendTransactionEpic,
);
