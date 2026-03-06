import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output
} from '@angular/core';
import {DocumentLookup, UserDocument, UserDocumentQueryOptions} from "./domains/user-document.serializer";
import {FileUploaderService} from "./services/file-uploader.services";
import {ActivatedRoute} from "@angular/router";
import {FileUploadAsComponent} from "./components";
import {SharedService} from "../../shared.service";

@Component({
  standalone: false,
  selector: 'file-upload-manager',
  templateUrl: './templates/upload-manager.html',
  styleUrls: ['./file-upload-manager.scss']
})
export class UploadManagerView implements OnInit {
  public message: string;
  @Input() isSameScreen: boolean;
  @Input() userMasterType: string;
  @Input() userId: string;
  @Output() cb: EventEmitter<any> = new EventEmitter<any>();
  coreState: UserDocumentQueryOptions = new UserDocumentQueryOptions();

  documents: Array<UserDocument>;
  lookups: DocumentLookup;

  showUploadScreen: boolean = false;
  constructor(public service: FileUploaderService, public activatedRoute: ActivatedRoute, private sharedService: SharedService){}

  ngOnInit(){
      (<UserDocumentQueryOptions>this.coreState).userMasterType = this.userMasterType;
      (<UserDocumentQueryOptions>this.coreState).userId = this.userId;
      this.populateGrid();
  }

  populateGrid(){
      const success=(resp)=>{
          this.lookups = resp.lookups;
          this.documents =  resp.entities;
      };
      this.service.list(this.coreState).toPromise().then(success);
  }

    uploadAs(uploader)
    {
        const popup = {
            header: { text: 'New Upload', desc: 'Upload new files' },
            aside: 'modal-right',
            size: 'w-50'
        };
        const inputData = {
            userId: this.userId,
            lookups: this.lookups,
            uploader: uploader,
            actionType: 'Add'
        };

        const success = (resp: any)=> {
            this.sharedService.destroy();
            this.cb.emit(true);
            this.populateGrid();
        };
        const failure = ()=> {
            this.sharedService.destroy();
            this.cb.emit(true);
        };

        let modal$ = this.sharedService.showCustomPopup(FileUploadAsComponent, popup, inputData);
        modal$.then(success, failure);
    }
}
