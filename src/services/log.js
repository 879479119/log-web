import { stringify } from 'qs';
import request from '../utils/request';

export async function queryLogList() {
  return request('/api/log/list');
}

export async function queryLog(id) {
  return request(`/api/log/${id}`);
}

export async function createLog(body) {
  return request('/api/log/add', {
    method: 'POST',
    body,
  });
}

export async function editLog(body) {
  return request('/api/log/edit', {
    method: 'POST',
    body,
  });
}

