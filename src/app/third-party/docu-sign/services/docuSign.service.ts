import { HttpClient } from "@angular/common/http";
import {Injectable} from "@angular/core";

@Injectable()
export class DocuSignService {
  constructor(private http: HttpClient) {}
  sendForSignature(payload: any) {
    return this.http.post<{ url: string }>('https://localhost:7289/api/docusign/embedded-sign-send', payload);
  }

  reviewSendForSignature(payload: any) {
    return this.http.post<{ url: string }>('https://localhost:7289/api/docusign/embedded-sign-review-send', payload);
  }

  // saveRecipientDocStatus(payload: any) {
  //   return this.http.post<{ url: string }>('https://localhost:7289/api/docusign/embedded-sign', payload);
  // }
}
