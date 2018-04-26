import { stringify } from 'qs';
import request from '../utils/request';

export async function queryABList() {
  return request('/api/ab/list');
}

export async function queryAB(id) {
  return request(`/api/ab/${id}`);
}

export async function createAB(body) {
  return request('/api/ab/add', {
    method: 'POST',
    body,
  });
}

export async function editAB(body) {
  return request('/api/ab/edit', {
    method: 'POST',
    body,
  });
}
