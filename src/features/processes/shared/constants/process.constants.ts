/**
 * Process Constants
 * Path: src/features/processes/shared/constants/process.constants.ts
 */

// Fixed Company ID for Wired People (using Riwi Talent backend)
export const WIRED_PEOPLE_COMPANY_ID = "7dd16aaa-793d-4017-8513-936df5e3010b";
export const WIRED_PEOPLE_COMPANY_NAME = "Wired People Inc.";

// Process configuration
export const DEFAULT_PAGE_SIZE = 12;
export const MAX_PAGE_SIZE = 100;
export const DEFAULT_SORT_BY = "createdAt";
export const DEFAULT_SORT_ORDER = "desc";

// Process limits
export const MAX_CANDIDATES_PER_PROCESS = 500;
export const MAX_SKILLS_PER_PROCESS = 20;
export const MAX_LANGUAGES_PER_PROCESS = 10;

// Process timeouts
export const PROCESS_CACHE_TTL = 5 * 60 * 1000; // 5 minutes
export const PROCESS_DETAIL_CACHE_TTL = 2 * 60 * 1000; // 2 minutes



