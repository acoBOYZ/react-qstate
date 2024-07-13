import { useQState } from "@acoboyz/react-qstate";

export const useTestState = (queryKey?: string) => useQState<string>('ACO .', queryKey);
