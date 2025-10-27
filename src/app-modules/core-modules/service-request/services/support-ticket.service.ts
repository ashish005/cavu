import {Injectable, Injector} from "@angular/core";
import {HttpRequest} from "@angular/common/http";
import  { OrgResourceService } from "@app-global"
import {SupportTicket, SupportTicketSerializer} from "../domains/support.domain";
import {Observable} from "rxjs";

@Injectable()
export class SupportTicketService extends OrgResourceService<SupportTicket>{
   constructor(public override injector: Injector) { super(injector, 'supportTicket', new SupportTicketSerializer()); }

   saveSupportTicket(form: any): Observable<any> {
        const supportUrl = `${this.viewUrl}`;
        let {
            supportTypeId, mediaTypeId, header, message, file, includeScreenshot, ip, pageURL,
            emailId, phoneNumber,
            userTypeId, userId
        } = form;

        const formData = new FormData();
        if(includeScreenshot)
        {
            //file = file.replace('data:image/png;base64,', '');
            formData.append('file', file);
        }

        formData.append('supportTypeId', supportTypeId);
        formData.append('mediaTypeId', mediaTypeId);
        formData.append('header', header);
        formData.append('message', message);
        formData.append('ip', ip);
        formData.append('pageURL', pageURL);

        formData.append('emailId', emailId);
        formData.append('userTypeId', userTypeId);
        formData.append('userId', userId);
        formData.append('phoneNumber', phoneNumber);
        //formData.append('supportTime', Date.now().toString());

        const request = new HttpRequest('POST', supportUrl, formData, super.getMultipartFileUploadRequestHeaders);
        return this.httpClient.request(request);
    }
}


