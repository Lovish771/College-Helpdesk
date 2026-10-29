import { curriculum, programs } from '../data/mockData';
import { USE_MOCK, wait, request } from './client';

export async function getCurriculum(programId, semester) {
  if (USE_MOCK) {
    await wait(300);
    const prog = curriculum.courses[programId];
    if (!prog) return [];
    const semKey = semester.replace('Semester ', '');
    return prog[semKey] || [];
  }
  return request(`/api/curriculum?program=${programId}&semester=${semester}`);
}

export async function getProgramsForCurriculum() {
  if (USE_MOCK) {
    await wait(200);
    return programs.filter(p => curriculum.programs.includes(p.id));
  }
  return request('/api/curriculum/programs');
}
