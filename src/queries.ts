// ./queries.ts
import { createQueryKeys } from '@lukemorales/query-key-factory';

export const queries = createQueryKeys('qstate', {
  default: null,
  uqk: (key: string) => [key]
});
