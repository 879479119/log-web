import { addCount, activeCount, count, enterCount, lineActiveDay, pvCount, viewTime, abClickRatio, abPvCount, abStayTime } from '../services/analysis';

export default {
  namespace: 'chart',

  state: {
    loading: true,
    ab: true,
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield [
        call(addCount),
        call(activeCount),
        call(count),
        call(enterCount),
        call(lineActiveDay),
        call(pvCount),
        call(viewTime),
      ];
      const map = {
        addCount: response[0].data,
        activeCount: response[1].data,
        count: response[2].data,
        enterCount: response[3].data,
        lineActiveDay: response[4].data,
        pvCount: response[5].data,
        viewTime: response[6].data,
        loading: false,
      }
      yield put({
        type: 'save',
        payload: map,
      });
    },
    *fetchAB({payload: {id}}, { call, put }) {
      const response = yield [
        call(abPvCount, {id, page: 'MainActivity'}),
        call(abStayTime, {id, page: 'MainActivity'}),
        call(abClickRatio, {id, page: 'MainActivity', btn: 'clickItem'}),
      ];
      const map = {
        abPvCount: response[0].data,
        abStayTime: response[1].data,
        abClickRatio: response[2].data,
        ab: false,
      }
      yield put({
        type: 'save',
        payload: map,
      });
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clear() {
      return {
        loading: true,
        ab: true,
      };
    },
  },
};
