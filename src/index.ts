import * as React from 'react';
import { useQuery, useQueryClient, QueryKey } from '@tanstack/react-query';
import SuperJSON from 'superjson';

/**
 * Custom hook for managing state with react-query and SuperJSON serialization.
 *
 * @template T - The type of the state data.
 * @param {QueryKey} queryKey - The unique key for the query.
 * @param {T} [initialData] - The initial data for the state.
 * @returns {[T, (data: T | ((prevState: T) => T)) => void, () => void]} 
 *   - The current state, a function to update the state, and a function to reset the state.
 *
 * @example
 * // Using the hook with an initial value
 * const [state, setState, resetState] = useQState<string>(['myUniqueKey'], 'initialValue');
 *
 * // Updating the state
 * setState('newValue');
 *
 * // Resetting the state
 * resetState();
 */
export function useQState<T>(queryKey: QueryKey, initialData?: T): [T, (data: T | ((prevState: T) => T)) => void, () => void] {
  const queryClient = useQueryClient();

  // Determine if the data should be serialized based on the initial data type or the generic type T
  const shouldSerialize = !(typeof initialData === 'string' || typeof initialData === 'number' || typeof initialData === 'boolean');

  // Memoize the initialData
  const memoizedInitialData = React.useMemo(() => initialData, [initialData]);

  const serializedInitialData = shouldSerialize
    ? memoizedInitialData !== undefined
      ? SuperJSON.stringify(memoizedInitialData)
      : SuperJSON.stringify({})
    : memoizedInitialData;

  const { data } = useQuery({
    queryKey: queryKey,
    queryFn: () => Promise.resolve(serializedInitialData),
    refetchInterval: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchIntervalInBackground: false,
    initialData: serializedInitialData,
    staleTime: Infinity,
  });

  const setData = React.useCallback((newData: T | ((prevState: T) => T)) => {
    queryClient.setQueryData(queryKey, (prevData: unknown) => {
      const parsedPrevData = shouldSerialize ? SuperJSON.parse<T>(prevData as string) : (prevData as T);
      const resolvedData = typeof newData === 'function' ? (newData as (prevState: T) => T)(parsedPrevData) : newData;
      return shouldSerialize ? SuperJSON.stringify(resolvedData) : resolvedData;
    });
  }, [queryClient, queryKey, shouldSerialize]);

  const resetData = React.useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: queryKey,
    });
    queryClient.refetchQueries({
      queryKey: queryKey,
    });
  }, [queryClient, queryKey]);

  const parsedData = React.useMemo(() => {
    if (data === undefined) return undefined;
    return shouldSerialize ? SuperJSON.parse<T>(data as string) : (data as T);
  }, [data, shouldSerialize]);

  return [parsedData as T, setData, resetData] as const;
}
