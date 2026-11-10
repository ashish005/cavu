import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@app-environments';
import { Observable } from 'rxjs';
import { AuthService } from '@app-third-party';

export type ProspectType = 'B2B' | 'B2C';

export interface Prospect {
  id: string;
  type: ProspectType;
  name: string;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  industry?: string | null;
  source: string;
  createdAt: string;
}

export interface ProspectList {
  items: Prospect[];
  page: number;
  pageSize: number;
  totalCount: number;
}

export interface PossibleDuplicateProspect extends Prospect {
  matchingIdentifiers: string[];
}

export interface ProspectDuplicateConflict {
  message: string;
  matches: PossibleDuplicateProspect[];
}

export interface CreateProspectRequest {
  type: ProspectType;
  name: string;
  email?: string;
  phone?: string;
  website?: string;
  industry?: string;
  confirmPossibleDuplicates?: boolean;
}

@Injectable({ providedIn: 'root' })
export class LeadGenApiService {
  private readonly baseUrl = environment.leadUrl.replace(/\/$/, '');

  constructor(private readonly http: HttpClient, private readonly auth: AuthService) {}

  checkReadiness(): Observable<string> {
    return this.http.get(`${this.baseUrl}/health/ready`, { responseType: 'text' });
  }

  getOpenApiUrl(): string {
    return `${this.baseUrl}/openapi/v1.json`;
  }

  listProspects(): Observable<ProspectList> {
    return this.http.get<ProspectList>(`${this.baseUrl}/api/v1/prospects?page=1&pageSize=50`, {
      headers: this.authorizationHeaders()
    });
  }

  createProspect(request: CreateProspectRequest): Observable<Prospect> {
    return this.http.post<Prospect>(`${this.baseUrl}/api/v1/prospects`, request, {
      headers: this.authorizationHeaders()
    });
  }

  private authorizationHeaders(): HttpHeaders {
    const token = this.auth.accessToken;
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }
}