import {Injectable, Injector} from '@angular/core';
import  { OrgResourceService } from "@app-global"
import {HttpEventType, HttpRequest} from "@angular/common/http";
import {ActivatedRouteSnapshot, Resolve, Router} from "@angular/router";
import {Observable, throwError} from "rxjs";
import {catchError, map, tap} from "rxjs/operators";
import {Student, StudentSerializer} from "../domains/student.serializer";

@Injectable()
export class StudentService extends OrgResourceService<Student> implements Resolve<any> {
  student: Student;
  constructor(public override injector: Injector) { super(injector, 'student', new StudentSerializer()); }

    resolve(route: ActivatedRouteSnapshot) {
        const success = (results) => {
            this.student = results.data;
        };
        const failure = (err: any) => {};
        const setup = this.read(route.params['studentId']);
        return this.performRouteResolver(route.data, setup, success, failure);
    }

  public getRegistrationNo(): Observable<string> {
    return this.httpClient
      .get(`${this.viewUrl}/registrationNo/${Date.now()}`, this.requestHeaders)
      .pipe(
        tap((resp: any) => console.log('read logged')),
        catchError(error=> this.handleError(error, () => this.getRegistrationNo()))
      );
  }

  public getUserAddressComRelation(userId: string): Observable<string> {
    return this.httpClient
      .get(`${this.viewUrl}/address-guardian/${userId}`, this.requestHeaders)
      .pipe(
        tap((resp: any) => console.log('read logged')),
          catchError(error=> this.handleError(error, () => this.getRegistrationNo()))
      );
  }

  updateCommunication(studentId, data) {
    return this.update.call(`${this.viewUrl}/communication}`, studentId, data);
  }

  updateGuardian(userId, data) {
    return this.httpClient
      .put(`${this.viewUrl}/guardian/${userId}`, data, this.requestHeaders)
      .pipe(
        tap(
          (error)=>{ this.handleError(error, () => this.updateGuardian(userId, data)) }
        )
      );
  }

  updateStudentBatch(studentId, data) {
    return this.update.call(`${this.viewUrl}/batch}`, studentId, data);
  }

  updateUserProfile(userId, profileId, file, cb, progressCb) {
    const formData = new FormData();
    formData.append('files', file);
    const uploadDocUrl = `${this.viewUrl}org-user/profile/${userId}/${profileId}`;

    this.updateFormData('POST', uploadDocUrl, formData, progressCb, cb);
  }

  updateRelativesProfile(profileId, file, cb, progressCb){
    const formData = new FormData();
    formData.append('files', file);
    const uploadDocUrl = `${this.viewUrl}guardian/profile/${profileId}`;
    const request = new HttpRequest('POST', uploadDocUrl, formData, { reportProgress: true });

    return this.httpClient.request(request).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        progressCb(Math.round(100 * event.loaded / event.total));
      } else if (event.type === HttpEventType.Response) {
        cb(event.body);
      }
    });
  }

  updateEmployeeRolesByEmployeeUserId(userId:string, roleIds: Array<string>): Observable<any> {
    const url: string = `${this.viewUrl}employee/roles/${userId}`;
    return this.httpClient.post<any>(url, roleIds, this.requestHeaders);
  }

  getModuleByRoleIds(ids: Array<string>): Observable<any> {
    const url: string = `${this.viewUrl}employee/role-modules`;
    return this.httpClient.post<any>(url, ids, this.requestHeaders);
  }


  /*createUser(userType: string, data: any): Observable<any> {
    const url: string = `${this.viewUrl}org-user/${userType}`;
    return this.httpClient.post<any>(url, data, this.requestHeaders);
  }*/
}
