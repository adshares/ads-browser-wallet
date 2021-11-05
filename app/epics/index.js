import { combineEpics } from 'redux-observable';
import validateForm from './validateForm';
import {
  confirmPasswordEpic,
  openDialogEpic,
  closeDialogEpic,
} from './authDialogEpics';
import {
  retrieveAccountEpic,
  retrieveNodesEpic,
  retrieveGatewaysEpic
} from './retrieveDataEpics';
import unsealEpic from './unsealEpic';
import {
  validateTransactionInputEpic,
  validateTransactionFormEpic,
  sendTransactionEpic,
  getGatewayFeeEpic,
  queueMessageEpic,
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
  selectAccountAfterSaveEpic,
  removeAccountEpic,
  createFreeAccountEpic,
  findAccountsEpic,
  refreshAccountsEpic,
} from './settingsEpics';

export default combineEpics(
  validateForm,
  retrieveAccountEpic,
  retrieveNodesEpic,
  unsealEpic,
  validateTransactionInputEpic,
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
  selectAccountAfterSaveEpic,
  removeAccountEpic,
  createFreeAccountEpic,
  findAccountsEpic,
  refreshAccountsEpic,
  retrieveGatewaysEpic,
  getGatewayFeeEpic,
  queueMessageEpic,
);
