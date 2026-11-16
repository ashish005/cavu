import { DiscoverySource } from './sources/discovery-sources.component';

export const DISCOVERY_SOURCES: DiscoverySource[] = [
  { key: 'registry', label: 'Corporate Filings & Registries', category: 'Registry', scope: 'Public Filings · Read-Only', latency: '1.2s', volume: '14.2M' },
  { key: 'web', label: 'Web Stack & Infrastructure Scanner', category: 'Web Signal', scope: 'Permitted DNS/HTTP · Verified', latency: '0.8s', volume: '8.9M' },
  { key: 'job-boards', label: 'Global Career & Hiring Boards', category: 'Job Board', scope: 'Partner API · Rate-Limited', latency: '1.5s', volume: '3.4M' },
  { key: 'directories', label: 'Local Clinical & Practice Directories', category: 'Directory', scope: 'Verified Licensing · HIPAA-Safe', latency: '1.1s', volume: '1.8M' },
  { key: 'tenders', label: 'Municipal & Enterprise RFP Portals', category: 'Tender Portal', scope: 'Public Procurement Feed', latency: '2.0s', volume: '420K' },
];
export const SOURCES = DISCOVERY_SOURCES;
export const CLASSES = ['Prospect', 'Opportunity', 'Employer', 'Candidate', 'Customer'];
export const GATES = [65, 75, 85];

export function srcs(r: { sourcesJson: string }, catalogue = DISCOVERY_SOURCES): string {
  try { return JSON.parse(r.sourcesJson).map((k: string) => catalogue.find(s => s.key === k)?.label ?? k).join(', '); } catch { return r.sourcesJson; }
}
export function shortId(id: string) { return 'RUN-' + id.replace(/-/g, '').slice(0, 4).toUpperCase(); }
