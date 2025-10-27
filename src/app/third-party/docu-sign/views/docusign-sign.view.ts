import {Component, Injectable} from "@angular/core";
import {DocuSignService} from "../services/docuSign.service";
import {Router} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

@Component({
    templateUrl: './templates/docusign-sign.html',
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class DocusignSignView {
  constructor(private docuSignService: DocuSignService, private router: Router) {}

  signing: boolean = false;
  review_signing: boolean = false;

  signingUrl: any;
  recipient = {
    name: '',
    email: ''
  };
  error: any;

  reviewAndSend() {
    this.review_signing = true;
    this.docuSignService.reviewSendForSignature({}).subscribe({
    next: (res: any) => {
        this.review_signing = false;
        window.location.href = res.signingUrl;
        // window.open(res.url, '_blank');
        // if (req.consentUrl) { window.location.href = response.consentUrl; } else
        // if (res.signingUrl) { this.signingUrl = res.signingUrl; } else { this.error = 'Unexpected response from server.'; }
      },
      error: (err: any) => {
        this.review_signing = false;
        if (err.status === 403 && err.error?.consentUrl) {
          window.location.href = err.error.consentUrl; // redirect to consent
        } else {
          this.error = 'Unexpected error while signing.';
        }
      }
    });
  }

  sendNow() {
    this.signing = true;
    // Call API to create envelope and launch embedded signing
    this.docuSignService.sendForSignature(this.recipient).subscribe({
      next: (res: any) => {
        this.signing = false;
        window.location.href = res.signingUrl;
      },
      error: (err) => {
        this.signing = false;
      }
    });
  }
}
