import {Injectable, Injector} from "@angular/core";
import {Observable, tap} from "rxjs";
import { OrgResourceService } from "@app-global";
import {Branch, BranchSerializer} from "../domains/org-branch.serializer";

@Injectable()
export class OrgBranchService extends OrgResourceService<Branch>
{
  constructor(public override injector: Injector) { super(injector, 'orgBranch', new BranchSerializer()); }

  public syncBranchTasks(branchId: string): Observable<any> {
    return this.httpClient
      .post(`${this.viewUrl}/generate-task/${branchId}`, null, this.requestHeaders)
      .pipe(
        tap(
          (resp: any) => console.log('read logged'),
          (error)=>{ this.handleError(error, () => this.syncBranchTasks(branchId)) }
        )
      );
  }
}
