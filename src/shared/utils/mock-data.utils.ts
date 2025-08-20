/**
 * Mock Data Generator for enriching Talent profiles
 * Keeps names from backend but adds variety to other fields
 */

import type { Talent } from '@/features/talent/types/talent.types';
import { generateProfessionalAvatar } from '@/shared/utils/avatar.utils';

// Random utility functions
function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomElements<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, array.length));
}

function randomRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Skills by category (for enrichment)
const skillsData = {
  publicHealth: [
    'Epidemiology', 'Biostatistics', 'Health Policy', 'Program Evaluation', 'Data Analysis',
    'Research Methods', 'Community Engagement', 'Grant Writing', 'Disease Surveillance',
    'Health Communication', 'SAS', 'R', 'SPSS', 'Environmental Health', 'Global Health'
  ],
  it: [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'AWS', 'Azure',
    'Docker', 'Kubernetes', 'MongoDB', 'PostgreSQL', 'GraphQL', 'REST APIs', 'CI/CD'
  ],
  cybersecurity: [
    'Network Security', 'Penetration Testing', 'SIEM', 'Incident Response', 
    'Vulnerability Assessment', 'Security Auditing', 'Compliance', 'Risk Management'
  ]
};

// Certifications by category
const certifications = {
  publicHealth: [
    'Certified in Public Health (CPH)',
    'Certified Health Education Specialist (CHES)',
    'FEMA Emergency Management',
    'Project Management Professional (PMP)'
  ],
  it: [
    'AWS Certified Solutions Architect',
    'Microsoft Azure Developer',
    'Google Cloud Professional',
    'Certified Kubernetes Administrator'
  ],
  cybersecurity: [
    'CISSP - Certified Information Systems Security Professional',
    'CEH - Certified Ethical Hacker',
    'CompTIA Security+',
    'GCIH - GIAC Certified Incident Handler'
  ]
};

// Languages with levels
const languages = [
  { name: 'English', levels: ['Native', 'Fluent', 'Professional'] },
  { name: 'Spanish', levels: ['Fluent', 'Professional', 'Conversational'] },
  { name: 'French', levels: ['Professional', 'Conversational'] },
  { name: 'Mandarin', levels: ['Conversational', 'Basic'] },
  { name: 'Portuguese', levels: ['Professional', 'Conversational'] }
];

// Experience templates for bio generation
const experienceTemplates = [
  'Experienced professional with {years} years in the industry.',
  'Seasoned expert bringing {years}+ years of hands-on experience.',
  '{years} years of progressive experience in challenging environments.',
  'Veteran professional with {years} years of proven success.',
  'Accomplished specialist with {years} years of industry expertise.'
];

// Achievement variations
const achievements = [
  'Led cross-functional teams to deliver complex projects on time and under budget.',
  'Implemented innovative solutions that improved efficiency by over 40%.',
  'Managed portfolios worth over $5M with consistent positive outcomes.',
  'Received multiple awards for excellence in service delivery.',
  'Published research in peer-reviewed journals and presented at international conferences.',
  'Developed and mentored teams of 10+ professionals.',
  'Spearheaded digital transformation initiatives across the organization.',
  'Achieved 99.9% uptime for critical systems and infrastructure.'
];

/**
 * Enhance existing talent data from backend with rich mock details
 * KEEPS the original name but enriches other fields
 */
export function enhanceTalentData(talent: Partial<Talent>, index?: number): Talent {
  // Determine a random category for skills/certs
  const categories = ['publicHealth', 'it', 'cybersecurity'] as const;
  const category = categories[Math.abs((index || 0) + (talent.firstName?.charCodeAt(0) || 0)) % 3];
  
  // Generate random years of experience (varies each time)
  const baseYears = Math.abs((talent.firstName?.charCodeAt(0) || 100) + (talent.lastName?.charCodeAt(0) || 100)) % 15;
  const years = baseYears + randomRange(1, 5);
  
  // Generate salary based on experience and category (with randomization)
  const baseSalary = category === 'publicHealth' ? 65000 : category === 'it' ? 85000 : 95000;
  const experienceBonus = years * randomRange(3000, 5000);
  const randomBonus = randomRange(-10000, 25000);
  const salaryMin = baseSalary + experienceBonus + randomBonus;
  const salaryMax = salaryMin + randomRange(20000, 45000);
  const hourlyRate = `$${Math.floor(salaryMin / 2080)}-${Math.floor(salaryMax / 2080)}/hr`;
  
  // Generate random skills if not present
  const numSkills = randomRange(5, 10);
  const selectedSkills = talent.skills?.length ? talent.skills : 
    randomElements(skillsData[category], numSkills).map((skill, idx) => ({
      id: `skill-${idx}`,
      name: skill,
      level: randomRange(2, 5)
    }));
  
  // Generate random languages if not present
  const numLanguages = randomRange(1, 3);
  const selectedLanguages = talent.languages?.length ? talent.languages :
    randomElements(languages, numLanguages).map((lang, idx) => ({
      id: `lang-${idx}`,
      name: lang.name,
      level: randomElement(lang.levels)
    }));
  
  // Generate random certifications
  const numCerts = randomRange(0, 3);
  const selectedCerts = talent.certifications?.length ? talent.certifications :
    randomElements(certifications[category], numCerts);
  
  // Generate bio with variety (changes each render)
  const experienceTemplate = randomElement(experienceTemplates);
  const achievement = randomElement(achievements);
  const bio = talent.bio || `${experienceTemplate.replace('{years}', years.toString())} ${achievement}`;
  
  // Random availability options
  const availabilities = ['Immediate', '1 week', '2 weeks notice', '1 month notice', 'Flexible'];
  const availability = talent.availability || randomElement(availabilities);
  
  // Generate score with some randomization
  const baseScore = 65 + (years * 2) + (selectedSkills.length);
  const score = Math.min(100, baseScore + randomRange(-5, 10));
  
  // Generate avatar if not present (using backend name)
  const avatar = talent.avatar || generateProfessionalAvatar(
    talent.firstName || 'Unknown',
    talent.lastName || 'User',
    talent.email,
    index
  );
  
  // Return enhanced talent keeping ALL original data from backend
  return {
    // Add enhanced/randomized fields FIRST (so they can be overridden)
    avatar,
    bio,
    yearsOfExperience: years,
    skills: selectedSkills,
    languages: selectedLanguages,
    certifications: selectedCerts,
    availability,
    hourlyRate,
    salaryMin,
    salaryMax,
    score,
    // Professional links (generated based on name)
    linkedin: talent.linkedin || `https://linkedin.com/in/${(talent.firstName || '').toLowerCase()}-${(talent.firstLastName || talent.lastName || '').toLowerCase()}`,
    github: category === 'it' && Math.random() > 0.3 ? 
      `https://github.com/${(talent.firstName || '').toLowerCase()}${(talent.firstLastName || talent.lastName || '').toLowerCase()}` : undefined,
    portfolio: Math.random() > 0.5 ? 
      `https://portfolio.${(talent.firstName || '').toLowerCase()}.com` : undefined,
    // Timestamps
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    
    // Override with ALL original data from backend (this preserves phone, site, cohort, etc.)
    ...talent,
    
    // Only provide defaults for absolutely required fields if missing
    id: talent.id || `talent-${index}`,
    firstName: talent.firstName || 'Unknown',
    email: talent.email || 'email@example.com',
    
    // IMPORTANT: Keep backend values for these fields, don't override
    // phone: preserved from talent
    // site: preserved from talent
    // location: preserved from talent
    // cohort: preserved from talent
    // stack: preserved from talent
    // profile: preserved from talent
    // statusId: preserved from talent
    // status: preserved from talent
    // activeProcesses: preserved from talent
    // matchScore: preserved from talent
    // matchCount: preserved from talent
  } as Talent;
}

/**
 * Generate mock talents (for testing without backend)
 */
export function generateMockTalents(count: number): Partial<Talent>[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `mock-talent-${i}`,
    firstName: `Test`,
    lastName: `User${i}`,
    email: `test${i}@example.com`,
    status: 1,
  }));
}

/**
 * Generate a single mock talent (for testing)
 */
export function generateMockTalent(index: number): Partial<Talent> {
  return {
    id: `mock-talent-${index}`,
    firstName: `Test`,
    lastName: `User${index}`,
    email: `test${index}@example.com`,
    status: 1,
  };
}