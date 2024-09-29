// ./index.ts
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

  const serializedInitialData = initialData !== undefined ? SuperJSON.stringify(initialData) : SuperJSON.stringify({});

  const { data } = useQuery({
    queryKey: queryKey,
    queryFn: () => Promise.resolve(serializedInitialData),
    refetchInterval: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchIntervalInBackground: false,
    initialData: serializedInitialData,
  });

  function setData(newData: T | ((prevState: T) => T)) {
    queryClient.setQueryData(queryKey, (prevData: string) => {
      const parsedPrevData = SuperJSON.parse<T>(prevData);
      const resolvedData = typeof newData === 'function' ? (newData as (prevState: T) => T)(parsedPrevData) : newData;
      return SuperJSON.stringify(resolvedData);
    });
  }

  function resetData() {
    queryClient.invalidateQueries({
      queryKey: queryKey,
    });
    queryClient.refetchQueries({
      queryKey: queryKey,
    });
  }

  const parsedData = React.useMemo(() => (data ? SuperJSON.parse<T>(data) : undefined), [data]);

  return [parsedData as T, setData, resetData];
}
