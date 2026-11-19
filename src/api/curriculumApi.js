import { programs } from '../data/mockData';
import { getProgramCurriculum } from '../data/curriculumData';
import { USE_MOCK, wait, request } from './client';

export async function getCurriculum(programId, semester) {
  if (USE_MOCK) {
    await wait(300);
    const semNumber = parseInt(String(semester).replace(/\D+/g, ''), 10) || 1;
    return getProgramCurriculum(programId, semNumber, programs);
  }
  return request(`/api/curriculum?program=${programId}&semester=${semester}`);
}

export async function getProgramsForCurriculum() {
  if (USE_MOCK) {
    await wait(200);
    return programs;
  }
  return request('/api/curriculum/programs');
}
