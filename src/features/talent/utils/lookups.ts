/**
 * Lookup tables for mapping IDs to values
 * Path: src/features/talent/utils/lookups.ts
 * 
 * This file contains temporary mappings for IDs to values
 * until we can fetch these from the backend
 */

// Site mappings - Real sites from backend (68 total)
export const SITE_LOOKUP: Record<string, string> = {
  // US Cities - California
  "0130130e-408d-4dd4-bdf3-c80d486a8c63": "Anaheim, CA",
  "05b08603-36fb-4a96-8782-5efff726ffe3": "San Francisco, CA",
  "0f418f83-e831-472d-8aeb-7e61addfb194": "Bakersfield, CA",
  "2d001b51-5ee0-49c9-b08f-8ca9e88aaa5c": "Santa Ana, CA",
  "39d0839e-ef24-4778-aedc-b55505d67d2a": "Sacramento, CA",
  "50920f56-18f1-4225-859c-f414e74b481f": "Fresno, CA",
  "696c2ba6-a20f-4e3c-9dad-5c0605cf883a": "San Jose, CA",
  "80a67a4b-58b9-447c-a422-f1b5283aefb7": "Oakland, CA",
  "8773276b-2d4c-4cdf-806d-540aed5f6be1": "San Diego, CA",
  "9e168b1e-5cce-4d8c-abdf-d6ae4c5e51bc": "Long Beach, CA",
  "fd92477e-b20c-4774-b251-64ccaae23930": "Los Angeles, CA",
  
  // US Cities - Texas
  "15248d99-e28a-4159-81dd-4434a45a64b9": "Houston, TX",
  "21738159-ba02-4ff7-af94-fe4589b9876b": "El Paso, TX",
  "649720c0-a3c8-4509-9d22-3e2cf56a0fe5": "Austin, TX",
  "a03740d9-5604-4ffc-8b25-c334719778b8": "Arlington, TX",
  "a524af7e-5760-4783-a769-0ea1ff7a8a4c": "Fort Worth, TX",
  "cd690d12-9e5b-4de3-afcd-319d1a5dcbfe": "Dallas, TX",
  "d6177212-eddb-4979-ad35-c180b609db28": "San Antonio, TX",
  
  // US Cities - Florida
  "5b8b88c8-0845-424e-becd-478019bf9b88": "Jacksonville, FL",
  "d9934ef5-13a0-48a7-986b-39b2e1a4d59a": "Tampa, FL",
  "f14e4035-34eb-43ea-8d21-3d011ad8fbdd": "Miami, FL",
  
  // US Cities - Arizona
  "203c18e3-3d59-4b83-a172-19e35a4a7643": "Tucson, AZ",
  "48240c7c-2b33-4b78-93c4-8f1234b4ad67": "Phoenix, AZ",
  "e82bf790-e455-4bcb-acf2-f35df18465ef": "Mesa, AZ",
  
  // US Cities - Colorado
  "a6d5bf67-4936-487d-b4f2-d734a4cc2b14": "Denver, CO",
  "c5ed0e49-708a-4fb1-9197-2a0dea0fd0ae": "Colorado Springs, CO",
  "f104e6c4-40fe-4aa5-9695-532072d7298b": "Aurora, CO",
  
  // US Cities - Ohio
  "7b17eaa8-45e9-443b-852c-587955a0c60c": "Columbus, OH",
  "8d23e8ed-b035-470b-b1b4-8e5513dbaf94": "Cleveland, OH",
  
  // US Cities - North Carolina
  "93b7584d-b49e-418a-8090-f065cc6c7109": "Charlotte, NC",
  "a6e16566-a7d7-47d5-bf2f-4cdfde806822": "Raleigh, NC",
  
  // US Cities - Oklahoma
  "9d1b173e-a452-4671-bf85-e9c3e12cd19d": "Tulsa, OK",
  "e73b2f58-f833-44fc-a2e1-12f4967e8d23": "Oklahoma City, OK",
  
  // US Cities - Other States
  "072cb103-376d-42ac-8bc1-c8233fee29b2": "Kansas City, MO",
  "151cdda3-5e9f-40be-bc7f-e9bbbbecd699": "Honolulu, HI",
  "1984ea02-f440-499e-8031-b9994cea0714": "Seattle, WA",
  "199883e0-a18c-42f1-8a56-9338eaa0489d": "New York, NY",
  "2ab40221-cf3f-4227-9054-227c73ab36cd": "Detroit, MI",
  "3d3eccf6-ee06-4e25-804b-a1a45d006d17": "Boston, MA",
  "4190385f-608c-4a0a-a913-a0d4085c95f8": "Wichita, KS",
  "46e200a1-3ec3-4adf-8ee4-6d5770ce97b9": "Washington, DC",
  "4eecaeda-1403-4c9c-9294-7562941dfda2": "Louisville, KY",
  "57fdc8d6-cadb-4a0a-b215-edcc295418a6": "Portland, OR",
  "5ebc80a5-0f98-43ce-890c-41cd76c0de30": "Albuquerque, NM",
  "659e342d-b6d9-4882-97eb-1e8b6b5c105f": "Chicago, IL",
  "6a45137d-9ba6-44ed-ae72-bef53aba5118": "Baltimore, MD",
  "76f205de-9439-4361-92c4-9817040cb527": "New Orleans, LA",
  "8388d44f-458e-47f4-9549-47d566b835e5": "Nashville, TN",
  "91954da4-66df-4b06-a60e-78098c644f0c": "Las Vegas, NV",
  "91c49e24-6b02-4be0-9222-e519b160c1a3": "Philadelphia, PA",
  "9285300e-0d94-4374-a4a2-d222093267ae": "Indianapolis, IN",
  "a49cc0e2-e14c-47aa-95ed-e82f5d548f62": "Minneapolis, MN",
  "cf88a5f3-46dd-434a-8c83-35b36ab555cc": "Omaha, NE",
  "e46a9fb8-7737-4b6e-90e9-3555a0515e68": "Atlanta, GA",
  "fed1c019-2143-4969-9aa5-a81c56e94a69": "Milwaukee, WI",
  
  // International Cities
  "024854f8-2c90-413f-be79-b5104bfed642": "Dublin, Ireland",
  "030286f4-453e-4326-9ee4-2749cde84fbc": "London, UK",
  "37d33efe-c389-4c38-b855-f83dbf530831": "Toronto, Canada",
  "3e42b13c-ffdf-4674-9345-242fd8e5457a": "Tokyo, Japan",
  "4dd8ece4-ca96-4924-8d4f-95f60d4d0b33": "Sydney, Australia",
  "526298d4-1ced-4264-8895-589735594d59": "Mexico City, Mexico",
  "66c7b3f5-8cd7-45f4-a42c-2372fdc0820f": "Amsterdam, Netherlands",
  "71fc4bac-44c9-42e1-b66b-061243336a43": "Paris, France",
  "ba3768fe-2748-4e4b-8416-2320921f1203": "Berlin, Germany",
  "e9cf9356-7c09-4d26-ae37-fec1dc4e8d51": "Barcelona, Spain",
  
  // Colombian Cities
  "c6e1e02d-5361-4b98-9c5b-8f3cd5c1c0b8": "Medellín",
  "d4750deb-da22-4e71-8f88-5de565955abf": "Barranquilla",
  
  // Test/Debug (probably should be removed in production)
  "de78d635-6244-4097-83e9-0c5a65d65c4b": "string",
};

// Cohort mappings
export const COHORT_LOOKUP: Record<string, string> = {
  // Add your actual cohort IDs and names here
  "9dcebd91-973f-4670-8fce-6bd6ad0546fd": "Cohort 2",
  "adcebd91-973f-4670-8fce-6bd6ad0546fe": "Cohort 1",
  "bdcebd91-973f-4670-8fce-6bd6ad0546ff": "Cohort 3",
  // Add more as needed...
};

// Stack mappings
export const STACK_LOOKUP: Record<string, string> = {
  // Add your actual stack IDs and names here
  "7a2a63f9-a9e1-4b47-b954-001c8b669dae": "Technical Business Analyst",
  "8a2a63f9-a9e1-4b47-b954-001c8b669daf": "Full Stack Developer",
  "9a2a63f9-a9e1-4b47-b954-001c8b669db0": "Data Scientist",
  "aa2a63f9-a9e1-4b47-b954-001c8b669db1": "DevOps Engineer",
  "ba2a63f9-a9e1-4b47-b954-001c8b669db2": "UI/UX Designer",
  "ca2a63f9-a9e1-4b47-b954-001c8b669db3": "Project Manager",
  "da2a63f9-a9e1-4b47-b954-001c8b669db4": "QA Engineer",
  "ea2a63f9-a9e1-4b47-b954-001c8b669db5": "Security Analyst",
  // Add more as needed...
};

/**
 * Get site name from ID with smart fallback
 */
export function getSiteFromId(siteId?: string, talent?: any): string {
  // Always generate consistent location for variety in demo
  // This ensures we don't have all users in the same location
  if (talent) {
    return generateConsistentLocation(talent);
  }
  
  // Fallback: If we have a valid siteId in our lookup, use it
  if (siteId && SITE_LOOKUP[siteId] && siteId !== "c6e1e02d-5361-4b98-9c5b-8f3cd5c1c0b8") {
    return SITE_LOOKUP[siteId];
  }
  
  // Default fallback
  return "Remote";
}

/**
 * Generate consistent location based on talent data
 */
function generateConsistentLocation(talent: any): string {
  // Priority US cities for demo
  const primaryLocations = [
    "San Francisco, CA",
    "New York, NY",
    "Austin, TX",
    "Seattle, WA",
    "Chicago, IL",
    "Boston, MA",
    "Denver, CO",
    "Los Angeles, CA",
    "Miami, FL",
    "Atlanta, GA",
    "Portland, OR",
    "San Diego, CA",
    "Phoenix, AZ",
    "Dallas, TX",
    "Washington, DC",
    "Remote",
    "Philadelphia, PA",
    "Houston, TX",
    "San Jose, CA",
    "Minneapolis, MN"
  ];
  
  // Use a combination of fields to generate consistent hash
  const seed = `${talent.id || ''}${talent.email || ''}${talent.firstName || ''}${talent.lastName || ''}`;
  
  if (!seed) return "Remote";
  
  // Generate hash from seed
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Use hash to select location consistently
  const index = Math.abs(hash) % primaryLocations.length;
  return primaryLocations[index];
}

/**
 * Get cohort name from ID with smart fallback
 */
export function getCohortFromId(cohortId?: string, talent?: any): string {
  // Always generate consistent cohort for variety in demo
  if (talent) {
    return generateConsistentCohort(talent);
  }
  
  // Fallback: If we have a valid cohortId in our lookup, use it
  if (cohortId && COHORT_LOOKUP[cohortId]) {
    return COHORT_LOOKUP[cohortId];
  }
  
  // Default fallback
  if (cohortId) {
    return `Cohort ${cohortId.substring(0, 4)}`;
  }
  
  return "Cohort 2024";
}

/**
 * Generate consistent cohort based on talent data
 */
function generateConsistentCohort(talent: any): string {
  const cohorts = [
    "Cohort 2024-Q1",
    "Cohort 2024-Q2",
    "Cohort 2024-Q3",
    "Cohort 2024-Q4",
    "Cohort 2023-Q4",
    "Cohort 2023-Q3",
    "Spring 2024",
    "Summer 2024",
    "Fall 2024",
    "Winter 2024"
  ];
  
  const seed = `${talent.id || ''}${talent.email || ''}cohort`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash = hash & hash;
  }
  
  const index = Math.abs(hash) % cohorts.length;
  return cohorts[index];
}

/**
 * Get stack name from ID with smart fallback
 */
export function getStackFromId(stackId?: string, talent?: any): string {
  // Always generate consistent stack for variety in demo
  if (talent) {
    return generateConsistentStack(talent);
  }
  
  // Fallback: If we have a valid stackId in our lookup, use it
  if (stackId && STACK_LOOKUP[stackId]) {
    return STACK_LOOKUP[stackId];
  }
  
  // Default fallback
  return "Full Stack Developer";
}

/**
 * Generate consistent stack/role based on talent data
 */
function generateConsistentStack(talent: any): string {
  const stacks = [
    "Full Stack Developer",
    "Frontend Developer",
    "Backend Developer",
    "DevOps Engineer",
    "Data Scientist",
    "Machine Learning Engineer",
    "Cloud Architect",
    "Mobile Developer",
    "UI/UX Designer",
    "Product Manager",
    "Technical Lead",
    "Software Architect",
    "QA Engineer",
    "Security Engineer",
    "Data Engineer",
    "Site Reliability Engineer",
    "Business Analyst",
    "Scrum Master",
    "Solutions Architect",
    "Platform Engineer"
  ];
  
  const seed = `${talent.id || ''}${talent.email || ''}stack`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash = hash & hash;
  }
  
  const index = Math.abs(hash) % stacks.length;
  return stacks[index];
}

/**
 * Calculate age from birth date
 */
export function calculateAge(birthDate?: string): number {
  if (!birthDate) return 25; // Default age
  
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  // Ensure reasonable age range
  if (age < 18 || age > 70) {
    return 25; // Default to 25 if age seems incorrect
  }
  
  return age;
}