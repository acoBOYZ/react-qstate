import { useCallback } from 'react';
import { useQuery, useQueryClient, QueryKey } from '@tanstack/react-query';

export type Dispatch<T> = (prevState: T) => T;
export type DispatchFn<T> = (newData: T | Dispatch<T>) => void;
export type ResetFn = () => void;

/**
 * Custom hook for managing state with react-query.
 *
 * @template T - The type of the state data.
 * @param {QueryKey} queryKey - The unique key for the query.
 * @param {T} [initialData] - The initial data for the state.
 * @returns {[T, DispatchFn<T>, ResetFn]}
 * 
 * @desc The current state, a function to update the state, and a function to reset the state.
 *
 * @type {DispatchFn<T> = (newData: T | Dispatch<T>) => void}
 * @type {ResetFn = () => void}
 *
 * @example
 * // Using the hook with a string key
 * const [state, setState, resetState] = useQState<string>(['myUniqueKey'], 'initialValue');
 *
 * // Using the hook with an array key
 * const [state, setState, resetState] = useQState<string>(['user', 'profile'], 'initialValue');
 *
 * // Updating the state
 * setState('newValue');
 *
 * // Resetting the state
 * resetState();
 */
export function useQState<T>(
  queryKey: QueryKey,
  initialData?: T
): [T, DispatchFn<T>, ResetFn] {
  const queryClient = useQueryClient();

  /**
   * @note Use initialData directly
   */
  // const memoizedInitialData = useMemo(() => initialData, [initialData]);

  const { data } = useQuery({
    queryKey: queryKey,
    enabled: false,
    staleTime: Infinity,
    refetchInterval: false,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retryOnMount: false,
    notifyOnChangeProps: ["data"],
    throwOnError: false,
    initialData: initialData,
    experimental_prefetchInRender: true,
  });

  const setData: DispatchFn<T> = useCallback((newData: T | Dispatch<T>) => {
    queryClient.setQueryData(queryKey, (prevData: T | undefined) => {
      const resolvedData = typeof newData === 'function'
        ? (newData as Dispatch<T>)(prevData as T)
        : newData;

      return resolvedData;
    });
  }, []);

  const resetData: ResetFn = useCallback(() => {
    queryClient.resetQueries({
      queryKey: queryKey,
    });
  }, []);

  return [data as T, setData, resetData];
}