import { stringify } from 'qs';
import request from '../utils/request';

export async function addCount() {
  return request('/api/analysis/addCount');
}

export async function count() {
  return request('/api/analysis/count');
}

export async function activeCount() {
  return request('/api/analysis/activeCount');
}

export async function lineActiveDay() {
  return request('/api/analysis/lineActiveDay');
}

export async function pvCount() {
  return request('/api/analysis/pvCount');
}

export async function viewTime() {
  return request('/api/analysis/viewTime');
}

export async function enterCount() {
  return request('/api/analysis/enterCount');
}



export async function abStayTime({id, page}) {
  return request(`/api/contrast/stayTime?testId=${id}&page=${page}`);
}

export async function abClickRatio({id, page, btn}) {
  return request(`/api/contrast/clickRatio?testId=${id}&page=${page}&buttonId=${btn}`);
}

export async function abPvCount({id, page}) {
  return request(`/api/contrast/pvCount?testId=${id}&page=${page}`);
}
