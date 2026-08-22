import { useQuery } from "@tanstack/react-query";

import { accountDeletionService } from "@/services/account-deletion.service";
import type { DeletionScope } from "@/interfaces/account-deletion.interface";

/** Fetched only while the deletion modal is open (enabled), not on page load - avoids firing the booking-service/event-service round trip every time a settings page renders. */
export function useDeletionEligibility(scope: DeletionScope, enabled: boolean) {
  return useQuery({
    queryKey: ["auth", "deletion-eligibility", scope],
    queryFn: () => accountDeletionService.checkEligibility(scope),
    enabled,
    retry: false,
    staleTime: 0,
  });
}
