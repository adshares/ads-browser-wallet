export const GET_CURRENCY_EXCHANGE_COURSE = 'GET_CURRENCY_EXCHANGE_COURSE';
export const GET_CURRENCY_EXCHANGE_COURSE_SUCCESS = 'GET_CURRENCY_EXCHANGE_COURSE_SUCCESS';
export const GET_CURRENCY_EXCHANGE_COURSE_FAILURE = 'GET_CURRENCY_EXCHANGE_COURSE_FAILURE';

export const getCurrencyExchangeCourse = () => ({
  type: GET_CURRENCY_EXCHANGE_COURSE,
});

export const getCurrencyExchangeCourseSuccess = rate => ({
  type: GET_CURRENCY_EXCHANGE_COURSE_SUCCESS,
  rate
});

export const getCurrencyExchangeCourseFailure = error => ({
  type: GET_CURRENCY_EXCHANGE_COURSE_FAILURE,
  error,
});
