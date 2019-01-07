import { combineEpics } from 'redux-observable';
import validateForm from './validateForm';
import {
  confirmPasswordEpic,
  openDialogEpic,
  closeDialogEpic,
} from './authDialogEpics';
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
  importAccountPublicKeyEpic,
  saveAccountEpic,
  removeAccountEpic,
} from './settingsEpics';

export default combineEpics(
  validateForm,
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
  importAccountPublicKeyEpic,
  saveAccountEpic,
  removeAccountEpic,
);
