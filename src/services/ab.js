import { stringify } from 'qs';
import request from '../utils/request';

export async function queryABList() {
  return request('/api/abList');
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
