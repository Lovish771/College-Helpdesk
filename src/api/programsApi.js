import * as d from '../data/mockData';
import { request } from './client';
export const getPrograms = () => request('/api/programs', () => d.programs);
export const getProgramDetails = (id) => request(`/api/programs/${id}`, () => d.programs.find((p) => p.id === id));
export const getAdmissionsInfo = () => request('/api/admissions', () => ({ steps: d.admissionSteps, deadlines: d.deadlines, faqs: d.faqs }));
export const getFees = () => request('/api/fees', () => d.programs.map((p) => ({ program: p.name, ...d.fees[p.id] })));
export const getScholarships = () => request('/api/scholarships', () => d.scholarships);
export const getHostelInfo = () => request('/api/hostel', () => d.hostel);
export const getDocuments = () => request('/api/documents', () => d.documents);
export const getContact = () => request('/api/contact', () => d.contact);
export const checkEligibility = (body) => request('/api/eligibility', () => {
  const p = d.programs.find((x) => x.id === body.programId);
  if (!p.accepts.includes(body.qualification)) return { eligible: false, message: `${p.short} requires: ${p.accepts.join(' or ')}.` };
  if (Number(body.percent) < p.minPercent) return { eligible: false, message: `Sample minimum for ${p.short} is ${p.minPercent}%. Please confirm with the Admission Office.` };
  return { eligible: true, message: `You appear to meet the sample criteria for ${p.short}. Final eligibility is decided by the institution.` };
}, { method: 'POST', body: JSON.stringify(body) });
