import { from, of } from 'rxjs';
import { ofType } from 'redux-observable';
import { mergeMap, switchMap, catchError } from 'rxjs/operators';
import AdsOperatorApi from '../utils/adsOperatorApi';
import {
  GET_CURRENCY_EXCHANGE_COURSE, getCurrencyExchangeCourseFailure,
  getCurrencyExchangeCourseSuccess,
} from '../actions/adsOperatorApiActions';
import { RpcError } from '../actions/errors';

const api = new AdsOperatorApi();

// eslint-disable-next-line import/prefer-default-export
export const getCurrencyExchangeCourseEpics = action$ => action$.pipe(
  ofType(GET_CURRENCY_EXCHANGE_COURSE),
  switchMap(() => from(api.getCurrencyExchangeCourse())
    .pipe(
      mergeMap(course => of(getCurrencyExchangeCourseSuccess(course))),
      catchError(error => of(getCurrencyExchangeCourseFailure(
        error instanceof RpcError ? error.message : 'Unknown error'
      )))
    )
  )
);
