/** Shapes of `GET {tenant}/api/v1/subscription/entitlements`. */

export type TenantAccessLevel = 'Full' | 'ReadOnly';

export interface ModuleEntitlement {
    code: string;
    name: string;
    enabled: boolean;
}

/** `userTypeCode` is an org user type code, or '*' for a cap on all members. A null limit means unlimited. */
export interface SeatUsage {
    userTypeCode: string;
    name: string;
    limit: number | null;
    used: number;
}

export interface TenantEntitlements {
    tenantId: string;
    softwareId: number;
    licenseId: number | null;
    planId: number | null;
    planName: string | null;
    licenseStatus: string | null;
    validTo: string | null;
    access: TenantAccessLevel;
    modules: ModuleEntitlement[];
}

export interface TenantEntitlementsResponse {
    entitlements: TenantEntitlements;
    seatUsage: SeatUsage[];
}

/** Modules the plans do not list are not gated, matching the API. */
export const isModuleEnabled = (entitlements: TenantEntitlements | null, moduleCode: string): boolean => {
    if (!entitlements) {
        return true;
    }
    const module = entitlements.modules.find(m => m.code.toLowerCase() === moduleCode.toLowerCase());
    return !module || module.enabled;
};
