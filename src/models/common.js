import { queryTypes, queryCommon } from '../services/common';

export default {
  namespace: 'common',

  state: {
    appList: null,
    appVersions: null,
    appPlatforms: null,
    logTypes: null,
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield [call(queryTypes), call(queryCommon)]
      yield put({
        type: 'save',
        payload: response[0].data,
      })
      yield put({
        type: 'save',
        payload: response[1].data,
      })
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },

  subscriptions: {
    setup({ dispatch }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      dispatch({
        type: "fetch",
      })
    },
  },
};
