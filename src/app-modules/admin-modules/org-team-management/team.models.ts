// Teams (tenant API api/v1/teams): who belongs, how tasks reach them, their lead and outside contacts.

export type TeamMembershipMode = 'Static' | 'Dynamic' | 'Mixed';
export type TeamAssignmentStrategy = 'Queue' | 'RoundRobin' | 'LeastBusy';
export type TeamRuleKind = 'UserType' | 'Role' | 'Branch';

export interface NamedRef { id: string; name: string; }
export interface Page<T> { items: T[]; total: number; }

/** People, roles, user types and branches for the editor (from `teams/lookups`). */
export interface TeamLookups {
    isAdmin: boolean;
    users: NamedRef[];
    roles: {id: string; name: string; code: string}[];
    userTypes: NamedRef[];
    branches: NamedRef[];
}

/** A chosen person (`userId`), an excluded person (`isExcluded`) or an outside contact (name with email/phone). */
export interface TeamMember { id?: string | null; userId?: string | null; name?: string | null; email?: string | null; phone?: string | null; isExcluded?: boolean; }
export interface TeamRule { id?: string | null; kind: TeamRuleKind; operator: 'In' | 'NotIn'; values: string[]; }

export interface Team {
    id?: string | null;
    code: string;
    name: string;
    description?: string | null;
    category?: string | null;
    membershipMode: TeamMembershipMode;
    assignmentStrategy: TeamAssignmentStrategy;
    leadUserId?: string | null;
    isActive: boolean;
    rules: TeamRule[];
    members: TeamMember[];
}

export interface TeamSummary {
    id: string; code: string; name: string; description: string | null; category: string | null;
    membershipMode: TeamMembershipMode; assignmentStrategy: TeamAssignmentStrategy; lead: NamedRef | null; isActive: boolean;
    memberCount: number; externalCount: number; ruleCount: number; queuedTasks: number; openTasks: number;
}

export interface TeamMemberRow { userId: string; name: string; email: string; openTasks: number; chosen: boolean; }

export const TEAM_STRATEGIES: {value: TeamAssignmentStrategy; label: string; hint: string}[] = [
    {value: 'Queue', label: 'Anyone can pick it up', hint: 'Tasks wait in the team queue until a member takes them.'},
    {value: 'RoundRobin', label: 'Take turns', hint: 'Each task goes to the next member in turn.'},
    {value: 'LeastBusy', label: 'Least busy first', hint: 'Each task goes to the member with the fewest open tasks.'}
];

export const TEAM_RULE_KINDS: {value: TeamRuleKind; label: string}[] = [
    {value: 'Role', label: 'Has the role'}, {value: 'UserType', label: 'Is a'}, {value: 'Branch', label: 'Works at branch'}
];

export const newTeam = (): Team => ({
    code: '', name: '', description: '', category: '', membershipMode: 'Static', assignmentStrategy: 'Queue', leadUserId: null, isActive: true, rules: [], members: []
});

/** Membership follows what was filled in: chosen people, rules, or both. */
export const membershipOf = (t: Team): TeamMembershipMode => {
    const rules = t.rules.some(r => r.values.length);
    const people = t.members.some(m => m.userId && !m.isExcluded);
    return rules && people ? 'Mixed' : rules ? 'Dynamic' : 'Static';
};

export const toCode = (name: string) => name.trim().toUpperCase().replace(/[^A-Z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 60);
