import { stringify } from 'qs';
import request from '../utils/request';

export async function queryTypes() {
  return request('/api/type');
}

export async function queryCommon() {
  return request(`/api/common`);
}
