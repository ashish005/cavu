import {Component, Injectable, OnInit} from "@angular/core";
import {DocuSignService} from "../services/docuSign.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    templateUrl: './templates/docusign-recipient-signed-view.html',
    standalone: true
})
export class DocusignRecipientSignedView implements OnInit {
  constructor(private docuSign: DocuSignService, private route: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    // this.docuSign.saveRecipientDocStatus({}).subscribe({
    // next: (res: any) => {
    //     //window.location.href = res.signingUrl;
    //     // window.open(res.url, '_blank');
    //     // if (req.consentUrl) {
    //     //   window.location.href = response.consentUrl; // Redirect for consent
    //     // } else
    //
    //   },
    //   error: err => {}
    // });
  }
}
