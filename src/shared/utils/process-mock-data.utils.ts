/**
 * Mock Data Generator for Processes
 * Generates realistic fake data for demo purposes
 */

import type { Process } from '@/features/processes/domain/entities/process.entity';
import { ProcessStatus } from '@/features/processes/domain/value-objects/process-status.vo';
import { ProcessPriority } from '@/features/processes/domain/value-objects/process-priority.vo';

// Process titles by category
const processTitles = {
  publicHealth: [
    'Senior Epidemiologist - CDC Project',
    'Public Health Data Analyst',
    'Community Health Program Manager',
    'Global Health Initiative Coordinator',
    'Biostatistics Specialist',
    'Health Policy Research Analyst',
    'Disease Surveillance Officer',
    'Environmental Health Inspector',
    'Health Communications Director',
    'Pandemic Response Coordinator'
  ],
  it: [
    'Full Stack Developer - Healthcare Platform',
    'Cloud Solutions Architect',
    'DevOps Engineer - Infrastructure Team',
    'Senior Data Scientist - ML Projects',
    'UI/UX Designer - Digital Products',
    'Backend Engineer - Microservices',
    'Mobile App Developer - React Native',
    'Database Administrator - PostgreSQL',
    'Security Engineer - Application Security',
    'Technical Lead - Platform Team'
  ],
  cybersecurity: [
    'Security Operations Center Analyst',
    'Penetration Testing Specialist',
    'Cloud Security Architect',
    'Incident Response Team Lead',
    'Compliance and Risk Analyst',
    'Threat Intelligence Researcher',
    'Security Engineering Manager',
    'Vulnerability Assessment Expert',
    'Zero Trust Architecture Specialist',
    'CISO Advisory Consultant'
  ]
};

// Process descriptions templates
const descriptionTemplates = [
  'We are seeking a talented {title} to join our {team} team. This role involves {responsibility1} and {responsibility2}. The ideal candidate will have strong experience in {skill1} and {skill2}.',
  'Join our dynamic team as a {title}. You will be responsible for {responsibility1}, {responsibility2}, and driving innovation in {area}. We value expertise in {skill1} and {skill2}.',
  'Exciting opportunity for a {title} to make a significant impact on our {area} initiatives. Key responsibilities include {responsibility1} and {responsibility2}. Strong background in {skill1} required.',
  'We\'re looking for an experienced {title} to lead our {team} efforts. This position requires expertise in {skill1} and {skill2}, with a focus on {responsibility1}.',
  'Be part of our mission as a {title}. You\'ll work on {responsibility1} and {responsibility2}, utilizing your skills in {skill1} and {skill2} to deliver exceptional results.'
];

// Responsibilities by category
const responsibilities = {
  publicHealth: [
    'conducting epidemiological research',
    'analyzing health data trends',
    'developing health policies',
    'managing community outreach programs',
    'coordinating with healthcare providers',
    'implementing disease prevention strategies',
    'preparing grant proposals',
    'presenting findings to stakeholders'
  ],
  it: [
    'developing scalable applications',
    'implementing CI/CD pipelines',
    'optimizing system performance',
    'collaborating with cross-functional teams',
    'conducting code reviews',
    'designing system architectures',
    'mentoring junior developers',
    'ensuring code quality standards'
  ],
  cybersecurity: [
    'monitoring security threats',
    'conducting vulnerability assessments',
    'implementing security controls',
    'responding to security incidents',
    'developing security policies',
    'performing penetration testing',
    'managing security tools',
    'training staff on security best practices'
  ]
};

// Areas of focus
const areas = {
  publicHealth: ['public health', 'healthcare delivery', 'disease prevention', 'health equity', 'global health'],
  it: ['digital transformation', 'cloud infrastructure', 'product development', 'data analytics', 'platform engineering'],
  cybersecurity: ['threat detection', 'risk management', 'compliance', 'incident response', 'security operations']
};

// Teams
const teams = {
  publicHealth: ['Research', 'Policy', 'Community Health', 'Data Analytics', 'Program Management'],
  it: ['Engineering', 'Product', 'Infrastructure', 'Data', 'Platform'],
  cybersecurity: ['Security Operations', 'Risk Management', 'Compliance', 'Incident Response', 'Architecture']
};

// Company benefits (for description enhancement)
const benefits = [
  'Competitive salary and comprehensive benefits package',
  'Remote work flexibility with occasional office visits',
  'Professional development and training opportunities',
  'Health, dental, and vision insurance',
  '401(k) matching and retirement planning',
  'Generous PTO and flexible work schedule',
  'Cutting-edge technology and tools',
  'Collaborative and inclusive work environment'
];

// Generate process icon based on category
export function getProcessIcon(category: 'publicHealth' | 'it' | 'cybersecurity') {
  const icons = {
    publicHealth: '🏥',
    it: '💻',
    cybersecurity: '🔒'
  };
  return icons[category];
}

// Generate department badge color
export function getDepartmentColor(category: 'publicHealth' | 'it' | 'cybersecurity') {
  const colors = {
    publicHealth: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    it: 'bg-blue-100 text-blue-700 border-blue-200',
    cybersecurity: 'bg-purple-100 text-purple-700 border-purple-200'
  };
  return colors[category];
}

/**
 * Generate enhanced process description
 */
function generateDescription(title: string, category: 'publicHealth' | 'it' | 'cybersecurity'): string {
  const template = descriptionTemplates[Math.floor(Math.random() * descriptionTemplates.length)];
  const categoryResponsibilities = responsibilities[category];
  const categoryAreas = areas[category];
  const categoryTeams = teams[category];
  const skills = skillsData[category];
  
  const description = template
    .replace('{title}', title)
    .replace('{team}', categoryTeams[Math.floor(Math.random() * categoryTeams.length)])
    .replace('{area}', categoryAreas[Math.floor(Math.random() * categoryAreas.length)])
    .replace('{responsibility1}', categoryResponsibilities[Math.floor(Math.random() * categoryResponsibilities.length)])
    .replace('{responsibility2}', categoryResponsibilities[Math.floor(Math.random() * categoryResponsibilities.length)])
    .replace('{skill1}', skills[Math.floor(Math.random() * skills.length)])
    .replace('{skill2}', skills[Math.floor(Math.random() * skills.length)]);
  
  // Add a random benefit
  const benefit = benefits[Math.floor(Math.random() * benefits.length)];
  
  return `${description}\n\n${benefit}`;
}

// Skills by category (reuse from talent mock data)
const skillsData = {
  publicHealth: [
    'Epidemiology', 'Biostatistics', 'Health Policy', 'Program Evaluation',
    'Data Analysis', 'Research Methods', 'Community Engagement', 'Grant Writing',
    'Disease Surveillance', 'Health Communication', 'SAS', 'R', 'SPSS'
  ],
  it: [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java',
    'AWS', 'Azure', 'Docker', 'Kubernetes', 'MongoDB', 'PostgreSQL',
    'GraphQL', 'REST APIs', 'CI/CD', 'Agile', 'Git', 'Next.js'
  ],
  cybersecurity: [
    'Network Security', 'Penetration Testing', 'SIEM', 'Incident Response',
    'Vulnerability Assessment', 'Security Auditing', 'Compliance', 'Risk Management',
    'Firewall Management', 'Encryption', 'Ethical Hacking', 'Security+'
  ]
};

/**
 * Enhance existing process data with mock details
 */
export function enhanceProcessData(process: any, index: number = 0): any {
  // Determine category based on index or process name
  const categories: ('publicHealth' | 'it' | 'cybersecurity')[] = ['publicHealth', 'it', 'cybersecurity'];
  const category = categories[index % 3];
  
  // If process doesn't have a good title, generate one
  const title = process.name || processTitles[category][Math.floor(Math.random() * processTitles[category].length)];
  
  // Generate or enhance description
  const description = process.description || generateDescription(title, category);
  
  // Generate required skills if not present
  const requiredSkills = process.requiredSkills?.length > 0 
    ? process.requiredSkills 
    : generateSkills(category, 3 + Math.floor(Math.random() * 4));
  
  // Determine priority based on deadline or random
  const priority = process.priority || (Math.random() > 0.7 ? ProcessPriority.HIGH : ProcessPriority.MEDIUM);
  
  // Add department info
  const department = category === 'publicHealth' ? 'Public Health' 
    : category === 'it' ? 'Information Technology' 
    : 'Cybersecurity';
  
  // Calculate a more realistic fill rate
  const vacancies = process.vacancies || (5 + Math.floor(Math.random() * 15));
  const studentsCount = process.studentsCount || Math.floor(vacancies * Math.random() * 0.7);
  
  // Add location if not present
  const locations = [
    'Washington, DC',
    'New York, NY',
    'San Francisco, CA',
    'Chicago, IL',
    'Remote',
    'Austin, TX',
    'Boston, MA',
    'Seattle, WA'
  ];
  const location = process.location || locations[Math.floor(Math.random() * locations.length)];
  
  // Add salary range if not present
  const baseSalary = category === 'publicHealth' ? 70000 : category === 'it' ? 90000 : 100000;
  const salaryMin = process.salaryMin || (baseSalary + Math.floor(Math.random() * 30000));
  const salaryMax = process.salaryMax || (salaryMin + 20000 + Math.floor(Math.random() * 30000));
  
  // Add deadline if not present (random date in next 30-90 days)
  const deadline = process.deadline || new Date(
    Date.now() + (30 + Math.floor(Math.random() * 60)) * 24 * 60 * 60 * 1000
  ).toISOString();
  
  return {
    ...process,
    name: title,
    description,
    department,
    departmentColor: getDepartmentColor(category),
    icon: getProcessIcon(category),
    requiredSkills,
    priority,
    priorityLabel: getPriorityLabel(priority),
    vacancies,
    studentsCount,
    location,
    remote: location === 'Remote',
    salaryMin,
    salaryMax,
    currency: 'USD',
    deadline,
    // Add some tags for better categorization
    tags: process.tags || generateTags(category),
    // Enhanced status label
    statusLabel: getEnhancedStatusLabel(process.status || process.statusId),
    // Fill percentage for visual
    fillPercentage: Math.round((studentsCount / vacancies) * 100),
    // Urgency indicator
    isUrgent: priority === ProcessPriority.URGENT || priority === ProcessPriority.HIGH,
    // Days until deadline
    daysUntilDeadline: Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  };
}

/**
 * Generate skills for a category
 */
function generateSkills(category: 'publicHealth' | 'it' | 'cybersecurity', count: number) {
  const categorySkills = skillsData[category];
  const selected = [];
  
  for (let i = 0; i < count && i < categorySkills.length; i++) {
    const skill = categorySkills[Math.floor(Math.random() * categorySkills.length)];
    if (!selected.find(s => s.name === skill)) {
      selected.push({
        name: skill,
        level: 3 + Math.floor(Math.random() * 3),
        required: i < 2 // First 2 skills are required
      });
    }
  }
  
  return selected;
}

/**
 * Generate relevant tags
 */
function generateTags(category: 'publicHealth' | 'it' | 'cybersecurity') {
  const tagSets = {
    publicHealth: ['Healthcare', 'Research', 'Policy', 'Community', 'Analytics'],
    it: ['Development', 'Cloud', 'Agile', 'Innovation', 'Technology'],
    cybersecurity: ['Security', 'Compliance', 'Risk', 'Protection', 'Defense']
  };
  
  const tags = tagSets[category];
  const count = 2 + Math.floor(Math.random() * 2);
  const selected = [];
  
  for (let i = 0; i < count; i++) {
    const tag = tags[Math.floor(Math.random() * tags.length)];
    if (!selected.includes(tag)) {
      selected.push(tag);
    }
  }
  
  return selected;
}

/**
 * Get priority label
 */
function getPriorityLabel(priority: ProcessPriority): string {
  const labels = {
    [ProcessPriority.LOW]: 'Low Priority',
    [ProcessPriority.MEDIUM]: 'Medium Priority',
    [ProcessPriority.HIGH]: 'High Priority',
    [ProcessPriority.URGENT]: 'Urgent'
  };
  return labels[priority] || 'Medium Priority';
}

/**
 * Get enhanced status label
 */
function getEnhancedStatusLabel(status: ProcessStatus | number): string {
  const statusMap: Record<number | string, string> = {
    [ProcessStatus.DRAFT]: 'Draft',
    [ProcessStatus.ACTIVE]: 'Actively Recruiting',
    [ProcessStatus.IN_PROGRESS]: 'In Progress',
    [ProcessStatus.COMPLETED]: 'Position Filled',
    [ProcessStatus.CANCELLED]: 'Cancelled',
    [ProcessStatus.ON_HOLD]: 'On Hold',
    1: 'Actively Recruiting',
    2: 'Under Review',
    3: 'In Progress',
    4: 'Position Filled',
    5: 'Cancelled'
  };
  
  return statusMap[status] || 'Unknown';
}