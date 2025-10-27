import {Component, OnInit} from "@angular/core";
import {OrgUserDocument} from "../domains/org-user-document.serializer";
import {ActivatedRoute} from "@angular/router";
import {FetchEmployeeService, OrgUserAPIResolver} from "../services";

@Component({
  standalone: false,
  selector: 'employee-doc',
  styles: [`:host { display: contents;}`],
  template: ``
  //template: `<same-screen-file-upload-manager userMasterType="employee" isSameScreen="true" [userId]="userId"></same-screen-file-upload-manager>`
})
export class OrgUserDocumentView implements OnInit {
  submitted: boolean;
  gridData: Array<OrgUserDocument>;
  loadingGrid: boolean;
  userId: string;
  uploadDocumentUrl: string;

  constructor(public activatedRoute: ActivatedRoute,
              public currentEmployeeResolver: FetchEmployeeService) {
  }

  ngOnInit() {
    //this.userId = this.currentEmployeeResolver.employee.userId;
    /*this.apiResolver.orgUser.subscribe(r => {
      if(r){
        this.userId = r.userId;
        this.uploadDocumentUrl = this.configService.baseApiUrl + 'org-user/uploadFiles/' + this.userId;
        this.populateDocuments();
      }
    });*/
  }

  /*populateDocuments() {
    const success = (resp) => {
      this.gridData = resp.entities;
      this.loadingGrid = false;
    };

    const failure = (resp) => {
      this.loadingGrid = false;
    };
    this.documentService.read(this.userId).subscribe(success, failure);
  }*/

  /*onDocumentTypeClick(){
    const docType = this.activeDocumentType.find((r)=> r.id == this.activeDocumentTypeId);
    this.apiResolver.alertService.showDialog('Are you sure you want to upload as ' + `${docType.name}`, DialogType.confirm, (data) => {
      const formData = new FormData();
      formData.append('files', this.fileUploadManager.activeFile.file);
      const studentId = this.apiResolver.studentId;
      const uploadDocUrl = this.uploadDocumentUrl+ `/${studentId}/${docType.id}`;
      const request = new HttpRequest('POST', uploadDocUrl, formData, { reportProgress: true });
      this.fileUploadManager.uploadFileSubscriber(request);
    });
  }*/
}
