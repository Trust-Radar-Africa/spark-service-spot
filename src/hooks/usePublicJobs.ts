/**
 * Hook for fetching public jobs from Laravel API with fallback to local store
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useApiConfigStore } from '@/stores/apiConfigStore';
import { useJobPostingsStore, WORK_TYPE_OPTIONS } from '@/stores/jobPostingsStore';
import { JobPosting } from '@/types/admin';
import { 
  fetchPublicJobs, 
  convertApiJobToStore,
  JobFilters,
  PublicJobsResponse
} from '@/services/publicApi';

interface UsePublicJobsResult {
  jobs: JobPosting[];
  isLoading: boolean;
  error: string | null;
  filters: {
    countries: string[];
    locations: string[];
    workTypes: typeof WORK_TYPE_OPTIONS;
  };
  totalJobs: number;
  refetch: () => Promise<void>;
}

interface UsePublicJobsOptions {
  search?: string;
  country?: string;
  location?: string;
  workType?: string;
  experience?: string;
}

export function usePublicJobs(options: UsePublicJobsOptions = {}): UsePublicJobsResult {
  const { isLiveMode } = useApiConfigStore();
  const { getActiveJobs, fetchJobs } = useJobPostingsStore();
  
  const [apiJobs, setApiJobs] = useState<JobPosting[]>([]);
  const [apiFilters, setApiFilters] = useState<PublicJobsResponse['filters']>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    if (isLiveMode()) {
      // Live mode: fetch from API
      try {
        const filters: JobFilters = {};
        if (options.search) filters.search = options.search;
        if (options.country && options.country !== 'all') filters.country = options.country;
        if (options.location) filters.location = options.location;
        if (options.workType && options.workType !== 'all') filters.work_type = options.workType;
        if (options.experience && options.experience !== 'all') filters.experience = options.experience;

        const response = await fetchPublicJobs(filters);
        const convertedJobs = response.data.map(convertApiJobToStore);
        setApiJobs(convertedJobs);
        setApiFilters(response.filters);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch jobs from API, falling back to local:', err);
        setError('Failed to load jobs from server. Showing cached data.');
        // Fallback to local store
        await fetchJobs();
      }
    } else {
      // Demo mode: use local store
      await fetchJobs();
    }

    setIsLoading(false);
  }, [isLiveMode, options.search, options.country, options.location, options.workType, options.experience, fetchJobs]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Get jobs from appropriate source
  const jobs = useMemo(() => {
    if (isLiveMode() && apiJobs.length > 0) {
      return apiJobs;
    }
    
    // Use local store with filtering
    let localJobs = getActiveJobs();
    
    if (options.search) {
      const query = options.search.toLowerCase();
      localJobs = localJobs.filter(job => 
        job.title.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query) ||
        job.country.toLowerCase().includes(query)
      );
    }
    
    if (options.country && options.country !== 'all') {
      localJobs = localJobs.filter(job => job.country === options.country);
    }
    
    if (options.location) {
      const loc = options.location.toLowerCase();
      localJobs = localJobs.filter(job => job.location.toLowerCase().includes(loc));
    }
    
    if (options.workType && options.workType !== 'all') {
      localJobs = localJobs.filter(job => job.work_type === options.workType);
    }
    
    if (options.experience && options.experience !== 'all') {
      localJobs = localJobs.filter(job => job.experience_required === options.experience);
    }
    
    return localJobs;
  }, [isLiveMode, apiJobs, getActiveJobs, options]);

  // Get filter options
  const filters = useMemo(() => {
    if (isLiveMode() && apiFilters) {
      return {
        countries: apiFilters.countries || [],
        locations: apiFilters.locations || [],
        workTypes: WORK_TYPE_OPTIONS,
      };
    }
    
    // Build from local jobs
    const allJobs = getActiveJobs();
    const countries = [...new Set(allJobs.map(j => j.country))].sort();
    const locations = [...new Set(allJobs.map(j => j.location))].sort();
    
    return {
      countries,
      locations,
      workTypes: WORK_TYPE_OPTIONS,
    };
  }, [isLiveMode, apiFilters, getActiveJobs]);

  return {
    jobs,
    isLoading,
    error,
    filters,
    totalJobs: isLiveMode() && apiJobs.length > 0 ? apiJobs.length : getActiveJobs().length,
    refetch: fetchData,
  };
}
