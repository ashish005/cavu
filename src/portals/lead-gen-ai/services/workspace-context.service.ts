import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ActiveWorkspaceContext {
  workspaceId: string;
  clientBusinessId: string;
}

@Injectable({ providedIn: 'root' })
export class WorkspaceContextService {
  private readonly contextSubject = new BehaviorSubject<ActiveWorkspaceContext | null>(null);
  readonly context$ = this.contextSubject.asObservable();

  get current(): ActiveWorkspaceContext | null {
    return this.contextSubject.value;
  }

  setActive(context: ActiveWorkspaceContext): void {
    this.contextSubject.next(context);
  }

  clear(): void {
    this.contextSubject.next(null);
  }
}
