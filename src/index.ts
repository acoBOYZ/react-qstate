// ./index.ts
import * as React from 'react';
import { useQuery, useQueryClient, QueryKey } from '@tanstack/react-query';
import SuperJSON from 'superjson';
import { queries } from './queries';
import { generateUniqueKey } from './utils';

export function useQState<T>(initialData?: T, userQueryKey?: string): [T, (data: T | ((prevState: T) => T)) => void, () => void] {
  const queryClient = useQueryClient();

  const queryKey = userQueryKey ? queries.uqk(userQueryKey).queryKey : [generateUniqueKey()];
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
