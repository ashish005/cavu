// EP-01 / T-101: Workspace & Industry Profile types.
// Config data is served by the backend (GET /api/studio/config) — no hardcoding.
export type WorkspaceId = string;

export interface StudioRoute { path: string; label: string; icon: string }
export interface WorkspaceConfig {
  id: string; key: string; label: string; description: string; icon: string;
  routes: StudioRoute[]; capabilities: string[];
}
export interface IndustryProfile {
  key: string; label: string; stages: string[]; capabilities: string[];
}
export const DEFAULT_WORKSPACE_KEY = 'ai-studio-workspace';
export const DEFAULT_INDUSTRY_KEY = 'ai-studio-industry';
