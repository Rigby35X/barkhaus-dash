import { useLocation, useSearchParams as useRRSearchParams } from "react-router-dom";

export function usePathname() {
  return useLocation().pathname;
}

export function useSearchParams() {
  const [sp] = useRRSearchParams();
  return sp;
}
