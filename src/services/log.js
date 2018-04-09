import { stringify } from 'qs';
import request from '../utils/request';

export async function queryLogList() {
  return request('/api/logList');
}

export async function queryLog(id) {
  return request(`/api/log/${id}`);
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}
