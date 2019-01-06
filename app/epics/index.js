import { combineEpics } from 'redux-observable';
import validateForm from './validateForm';
import validatePassword from './validatePassword';
import {
  confirmPasswordEpic,
  openDialogEpic,
  closeDialogEpic,
} from './authDialogEpics';
import accountEditValidateForm from './accountEditValidateForm';
import editAccountEpic from './editAccountEpic';
import {
  retrieveAccountEpic,
  retrieveNodesEpic
} from './retrieveDataEpics';
import unsealEpic from './unsealEpic';
import {
  validateTransactionFormEpic,
  sendTransactionEpic
} from './transactionEpics';
import {
  secretDataAccessEpic,
  changePasswordEpic,
  eraseStorageEpic,
  generateKeysEpic,
  saveKeyEpic,
  removeKeyEpic,
} from './settingsEpics';

export default combineEpics(
  validateForm,
  accountEditValidateForm,
  validatePassword,
  editAccountEpic,
  retrieveAccountEpic,
  retrieveNodesEpic,
  unsealEpic,
  validateTransactionFormEpic,
  sendTransactionEpic,
  openDialogEpic,
  closeDialogEpic,
  confirmPasswordEpic,
  secretDataAccessEpic,
  changePasswordEpic,
  eraseStorageEpic,
  generateKeysEpic,
  saveKeyEpic,
  removeKeyEpic,
);
