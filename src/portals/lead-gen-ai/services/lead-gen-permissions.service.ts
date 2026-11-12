import { Injectable } from '@angular/core';
import { LeadGenApiService, PermissionsResponse } from './lead-gen-api.service';

/**
 * Caches the caller's permissions (org role + client-business role) and
 * exposes can()/canWrite for UI enforcement. The API still enforces
 * authorization server-side — this only hides/disables UI affordances.
 */
@Injectable({ providedIn: 'root' })
export class LeadGenPermissionsService {
  permissions: string[] = [];
  role = '';
  isOrganizationManager = false;
  loaded = false;

  constructor(private readonly api: LeadGenApiService) {
    this.load();
  }

  load(): void {
    this.api.getPermissions().subscribe({
      next: (p: PermissionsResponse) => {
        this.permissions = p.permissions ?? [];
        this.role = p.role ?? '';
        this.isOrganizationManager = !!p.isOrganizationManager;
        this.loaded = true;
      },
      error: () => { this.loaded = true; }
    });
  }

  can(permission: string): boolean {
    return this.isOrganizationManager || this.permissions.includes(permission);
  }

  /** True when the user may perform write/manage actions. */
  get canWrite(): boolean {
    return this.isOrganizationManager
      || this.permissions.some(p => p.endsWith('.manage') || p.endsWith('.write'));
  }
}
