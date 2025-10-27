import {Injectable, Injector} from '@angular/core';
import {OrgUserDocument, OrgUserDocumentSerializer} from "../domains/org-user-document.serializer";
import  { OrgResourceService } from "@app-global";
import {OrgEmployee, OrgEmployeeSerializer} from "../domains/org-employee.serializer";
import {ActivatedRouteSnapshot} from "@angular/router";
import {Observable, throwError, catchError, tap} from "rxjs";

@Injectable()
export class FetchEmployeeService extends OrgResourceService<OrgEmployee> {
    employee: OrgEmployee;
    constructor(override injector: Injector) { super(injector, 'employee', new OrgEmployeeSerializer()); }
    resolve(route: ActivatedRouteSnapshot | { data: {},  params: { id }}) {
        const success = (results) => {
            this.employee = results.data;
        };
        const failure = (err: any) => {};
        const setup = this.read(route.params.id);
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
                catchError(error=> this.handleError(error, () => this.getUserAddressComRelation(userId)))
            );
    }

    updateCommunication(studentId, data) {
        const _context = Object.create(this);
        _context['endpoint'] = 'org-user/communication';
        return this.update.call(_context, studentId, data);
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

    updateUserProfile(userId, profileId, file, cb, progressCb) {
        const formData = new FormData();
        formData.append('files', file);
        const uploadDocUrl = `${this.viewUrl}/profile/${userId}/${profileId}`;

        this.updateFormData('POST', uploadDocUrl, formData, progressCb, cb);
    }

    /*updateRelativesProfile(profileId, file, cb, progressCb){
        const formData = new FormData();
        formData.append('files', file);
        const uploadDocUrl = `${this.baseAPIUrl}guardian/profile/${profileId}`;
        const request = new HttpRequest('POST', uploadDocUrl, formData, { reportProgress: true });

        return this.httpClient.request(request).subscribe(event => {
            if (event.type === HttpEventType.UploadProgress) {
                progressCb(Math.round(100 * event.loaded / event.total));
            } else if (event.type === HttpEventType.Response) {
                cb(event.body);
            }
        });
    }*/
}

@Injectable()
export class OrgUserDocumentService extends OrgResourceService<OrgUserDocument> {
  constructor(override injector: Injector) { super(injector, 'employee/documents', new OrgUserDocumentSerializer()); }
}
