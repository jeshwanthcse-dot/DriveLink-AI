"use client";

import { useAppStore } from "@/store/app-store";
import { organizationService } from "@/services/organization-service";

export function useOrganizations() {
  const organizations = useAppStore((state) => state.organizations);
  const currentOrgId = useAppStore((state) => state.currentOrgId);
  const setCurrentOrgId = useAppStore((state) => state.setCurrentOrgId);

  const activeOrganization = organizations.find((org) => org.id === currentOrgId);

  return {
    organizations,
    currentOrgId,
    activeOrganization,
    setCurrentOrgId,

    // Query Helpers
    getAll: () => organizationService.getAll(organizations),
    getById: (id: string) => organizationService.getById(organizations, id),
    search: (term: string) => organizationService.search(organizations, term)
  };
}
