import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client.ts";
import type {
  GetCoursesQueryParams,
  GetCoursesResponse,
  GetElectivesQueryParams,
  GetElectivesResponse,
  SaveElectiveRequestBody,
  SaveElectiveResponse,
} from "@jumca/shared";

export const COURSES_QUERY_KEY = (params: GetCoursesQueryParams = {}) =>
  ["courses", "list", params] as const;

export const ELECTIVES_QUERY_KEY = (params: GetElectivesQueryParams = {}) =>
  ["courses", "electives", params] as const;

function buildQuery(params: Record<string, string | boolean | undefined | number>): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      query.set(key, String(value));
    }
  }
  const qs = query.toString();
  return qs ? `?${qs}` : "";
}

/**
 * Fetch courses from the database as per the semester and filters using React Query
 */
export const useCourses = (params: GetCoursesQueryParams = {}) =>
  useQuery({
    queryKey: COURSES_QUERY_KEY(params),
    queryFn: () =>
      apiClient<GetCoursesResponse>(
        `/api/courses${buildQuery({
          semester: params.semester,
          type: params.type,
          isElective: params.isElective,
        })}`
      ),
    staleTime: 5 * 60 * 1000,
  });

/**
 * Fetch electives grouped by basket for a semester using React Query
 */
export const useElectives = (params: GetElectivesQueryParams = {}) =>
  useQuery({
    queryKey: ELECTIVES_QUERY_KEY(params),
    queryFn: () =>
      apiClient<GetElectivesResponse>(
        `/api/courses/electives${buildQuery({
          semester: params.semester,
          basket: params.basket,
        })}`
      ),
    staleTime: 5 * 60 * 1000,
  });

/**
 * Mutation hook to save/update an elective in the database via POST request
 */
export const useSaveElective = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: SaveElectiveRequestBody) =>
      apiClient<SaveElectiveResponse>("/api/courses/electives", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};

/**
 * Helper hook to fetch both regular courses and electives for a specific semester
 */
export const useSemesterCoursesAndElectives = (semester: string) => {
  const coursesQuery = useCourses({ semester });
  const electivesQuery = useElectives({ semester });

  return {
    courses: coursesQuery.data?.data ?? [],
    electives: electivesQuery.data?.data ?? [],
    isLoading: coursesQuery.isLoading || electivesQuery.isLoading,
    isError: coursesQuery.isError || electivesQuery.isError,
    error: coursesQuery.error || electivesQuery.error,
    refetch: () => {
      coursesQuery.refetch();
      electivesQuery.refetch();
    },
  };
};
