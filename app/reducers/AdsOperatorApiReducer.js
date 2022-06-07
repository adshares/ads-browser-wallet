import * as actions from '../actions/adsOperatorApiActions';

const initialApiData = {
  currencyCourses: {
    usdRate: null,
  }
};

export default function (data = initialApiData, action) {
  switch (action.type) {
    case actions.GET_CURRENCY_EXCHANGE_COURSE_SUCCESS: {
      return {
        ...data,
        currencyCourses: {
          ...data.currencyCourses,
          usdRate: action.rate
        }
      };
    }

    default:
      return data;
  }
}
