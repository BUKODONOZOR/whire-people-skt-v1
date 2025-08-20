/**
 * Talent Data Generator
 * Generates consistent, realistic data for talent profiles
 */

import type { Talent, Skill, Language, Experience, Education } from '../types/talent.types';

/**
 * Generate hash from string
 */
function generateHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

/**
 * Generate talent data
 */
export function generateTalentData(id: string): Talent {
  const hash = generateHash(id);
  
  return {
    id,
    name: `Talent ${id}`,
    email: `talent${id}@example.com`,
    skills: [],
    cohort: `Cohort ${hash % 10}`,
  } as Talent;
}

export default {
  generateTalentData
};
