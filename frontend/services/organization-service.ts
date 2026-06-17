import { MockOrganization } from "@/mock/organizations";

export const organizationService = {
  getAll(orgs: MockOrganization[]): MockOrganization[] {
    return orgs;
  },

  getById(orgs: MockOrganization[], id: string): MockOrganization | undefined {
    return orgs.find((org) => org.id === id);
  },

  search(orgs: MockOrganization[], term: string): MockOrganization[] {
    if (!term) return orgs;
    const cleanTerm = term.toLowerCase();
    return orgs.filter(
      (org) =>
        org.name.toLowerCase().includes(cleanTerm) ||
        org.companyName.toLowerCase().includes(cleanTerm) ||
        org.industry.toLowerCase().includes(cleanTerm) ||
        org.manager.toLowerCase().includes(cleanTerm)
    );
  }
};
