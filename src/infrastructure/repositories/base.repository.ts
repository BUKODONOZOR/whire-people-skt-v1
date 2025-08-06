import { httpClient } from "@/infrastructure/http/http-client";

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface QueryParams extends PaginationParams {
  search?: string;
  filters?: Record<string, any>;
}

export abstract class BaseRepository<T, CreateDTO = any, UpdateDTO = any> {
  protected endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  /**
   * Get all items with optional pagination and filters
   */
  async findAll(params?: QueryParams): Promise<PaginatedResponse<T>> {
    const queryParams = this.buildQueryParams(params);
    return await httpClient.get<PaginatedResponse<T>>(this.endpoint, {
      params: queryParams,
    });
  }

  /**
   * Get a single item by ID
   */
  async findById(id: string | number): Promise<T> {
    return await httpClient.get<T>(`${this.endpoint}/${id}`);
  }

  /**
   * Create a new item
   */
  async create(data: CreateDTO): Promise<T> {
    return await httpClient.post<T>(this.endpoint, data);
  }

  /**
   * Update an existing item
   */
  async update(id: string | number, data: UpdateDTO): Promise<T> {
    return await httpClient.put<T>(`${this.endpoint}/${id}`, data);
  }

  /**
   * Partially update an existing item
   */
  async patch(id: string | number, data: Partial<UpdateDTO>): Promise<T> {
    return await httpClient.patch<T>(`${this.endpoint}/${id}`, data);
  }

  /**
   * Delete an item
   */
  async delete(id: string | number): Promise<void> {
    return await httpClient.delete<void>(`${this.endpoint}/${id}`);
  }

  /**
   * Check if an item exists
   */
  async exists(id: string | number): Promise<boolean> {
    try {
      await this.findById(id);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Build query parameters from QueryParams
   */
  protected buildQueryParams(params?: QueryParams): Record<string, any> {
    if (!params) return {};

    const queryParams: Record<string, any> = {};

    if (params.page !== undefined) queryParams.page = params.page;
    if (params.limit !== undefined) queryParams.limit = params.limit;
    if (params.sortBy) queryParams.sortBy = params.sortBy;
    if (params.sortOrder) queryParams.sortOrder = params.sortOrder;
    if (params.search) queryParams.search = params.search;

    if (params.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams[key] = value;
        }
      });
    }

    return queryParams;
  }
}

/**
 * Cache decorator for repository methods
 */
export function Cacheable(ttl: number = 60000) {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    const cache = new Map<string, { data: any; timestamp: number }>();

    descriptor.value = async function (...args: any[]) {
      const cacheKey = JSON.stringify({ method: propertyName, args });
      const cached = cache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < ttl) {
        return cached.data;
      }

      const result = await originalMethod.apply(this, args);
      cache.set(cacheKey, { data: result, timestamp: Date.now() });

      return result;
    };

    return descriptor;
  };
}