import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {StudentService} from "../services";
import {StudentDocumentForm} from "../forms/student-document.form";

@Component({
  standalone: false,
  templateUrl: './templates/document.html'
})
export class StudentDocumentView implements OnInit {
  submitted: boolean;
  gridData: Array<StudentDocumentForm>;
  loadingGrid: boolean;
  uploadDocumentUrl: string;
  userId: string;

  constructor(public activatedRoute: ActivatedRoute, private service: StudentService) {}

  ngOnInit() {
    this.userId = this.service.student.userId;
    //this.populateDocuments();
  }

  // populateDocuments() {
  //   const success = (resp) => {
  //     this.gridData = resp.entities;
  //     this.loadingGrid = false;
  //   };
  //
  //   const failure = (resp) => {
  //     this.loadingGrid = false;
  //   };
  //   this.documentService.read(this.service.student.id).subscribe(success, failure);
  // }

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
