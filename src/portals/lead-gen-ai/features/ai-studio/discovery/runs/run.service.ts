import {Injectable, Injector} from '@angular/core';
import {LeadResourceService} from "@app-global";
import {Run, RunSerializer} from "./run.serializer";
import {Observable, tap} from "rxjs";

@Injectable()
export class RunService extends LeadResourceService<Run>{
  constructor(public override injector: Injector) { super(injector, 'runs', new RunSerializer()); }

  runDiscovery(data): Observable<Run> {
    return this.httpClient.post<Run>(`${this.viewUrl}`, data);
  }
}
