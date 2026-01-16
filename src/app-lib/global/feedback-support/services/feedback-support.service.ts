import {Observable, catchError} from "rxjs";
import {Injectable, Injector} from "@angular/core";
import {HttpClient, HttpRequest} from "@angular/common/http";
import {ServiceRequestLookup} from "../domain/lookup.serializer";
import {CoreEndpointBase} from "@app-global";

@Injectable()
export class FeedbackSupportService extends CoreEndpointBase {
    masterType: ServiceRequestLookup;
    isLoading: boolean = false;
    constructor(public override injector: Injector) { super(injector); }

    getSupportLookup()
    {
        const promise = new Promise((resolve, reject) => {
            const success = (resp: any) => {
                this.isLoading = false;
                this.masterType = new ServiceRequestLookup(resp?.data);
                return resolve(true);
            };
            const failure = (err: any) => { return reject(err); };

            if(this.masterType?.supportTypes?.length)
            {
                return resolve(true);
            }
            this.isLoading = true;

            const endpointUrl = this.baseSectorAPIUrl + `ticketLookup/${this.apiVersion}`;
            return this.httpClient.get(endpointUrl, this.requestHeaders).toPromise().then(success, failure);
        });
        return promise;
    }

    getNotification(activeNavId: string) {
        const url = this.baseSectorAPIUrl + `portalNotification/${this.orgSetup.sectorMasterType}/${activeNavId}/summary?noLoader=true`;
        return this.httpClient.get(url, this.requestHeaders).toPromise();
    }

    dataURLtoBlob(dataURI) {
        let byteString;
        let mimeString;
        let ia;

        if (dataURI.split(',')[0].indexOf('base64') >= 0) {
            byteString = atob(dataURI.split(',')[1]);
        } else {
            byteString = encodeURI(dataURI.split(',')[1]);
        }
        // separate out the mime component
        mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to a typed array
        ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ia], {type:mimeString});
    }

    saveSupportTicket(form: any): Observable<any> {
        //return this.httpClient.post(`${this.configurationService.baseApiUrl}supportTicket`, formData, this.requestHeaders);
        const supportUrl = `${this.baseSectorAPIUrl}supportTicket`;

        //const { userId, email, mobile } = super.authService;

        let { supportTypeId, mediaTypeId, header, message, file, includeScreenshot, ip, pageURL} = form;

        const formData = new FormData();
        if(includeScreenshot)
        {
            file = file.replace('data:image/png;base64,', '');
            formData.append('file', file);
        }

        formData.append('supportTypeId', supportTypeId);
        formData.append('mediaTypeId', mediaTypeId);
        formData.append('header', header);
        formData.append('message', message);
        formData.append('ip', ip);
        formData.append('pageURL', pageURL);

        // formData.append('emailId', email);
        // formData.append('userId', userId);
        // formData.append('phoneNumber', mobile);

        // const request = new HttpRequest('POST', supportUrl, formData, this.getMultipartFileUploadRequestHeaders);
        // return this.httpClient.request(request);

        return  this.httpClient.post(supportUrl, formData, this.getMultipartFileUploadRequestHeaders);
    }

    supportTicketUploadImages(supportTicketId: any, file: any) {
        const supportUrl = `${this.baseSectorAPIUrl}supportTicket/${supportTicketId}/includes`;

        const formData = new FormData();
        formData.append('file', file);

        const request = new HttpRequest('PUT', supportUrl, formData, {
            headers: <any>this.requestHeaders.headers,
            reportProgress: true
        });
        return this.httpClient.request(request);
    }
}
