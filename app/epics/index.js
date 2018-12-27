
import { combineEpics } from 'redux-observable';
import validateForm from './validateForm';
import validatePassword from './validatePassword';
import { addAccountEpic, importKeysEpic, cleanForm } from './authDialogEpics';

export default combineEpics(
    validateForm,
    validatePassword,
    addAccountEpic,
    importKeysEpic,
    cleanForm,
);
