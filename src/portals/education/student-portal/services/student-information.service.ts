import  { OrgResourceService } from "@app-global";
import {Injectable, Injector} from "@angular/core";
import {catchError, map, take, tap} from "rxjs/operators";
import {Observable, throwError} from "rxjs";
import {
  StudentUser,
  StudentUserCommunicationSerializer,
  StudentUserSerializer
} from "../domains/student-user.serializer";

@Injectable()
export class StudentInformationService extends OrgResourceService<StudentUser>{
  constructor(public override injector: Injector) {
    super(injector, 'student-portal/org-user', new StudentUserSerializer());
  }

  public getByUserId(userId: string) {
    const serializer = new StudentUserSerializer();
    return this.httpClient
      .get(`${this.viewUrl}/${userId}`, this.requestHeaders)
      .pipe( take(1), map(resp => serializer.toJson(resp)), catchError((error)=>{ return throwError(error); }));
  }

  public getUserAddressComRelation(userId: string) {
    const serializer = new StudentUserCommunicationSerializer();
    return this.httpClient
      .get(`${this.viewUrl}/address-guardian/${userId}`, this.requestHeaders)
      .pipe(
        take(1),
        map(resp => serializer.toJson(resp)),
        catchError((error)=>{ return throwError(error); })
      );
  }
}
