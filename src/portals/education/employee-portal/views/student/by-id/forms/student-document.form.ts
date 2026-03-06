import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserDocument} from "../domains/document.serializer";

export class StudentDocumentForm  {
    customForm: FormGroup;

    constructor(public fb: FormBuilder) {
        this.customForm = this.fb.group({
            documentTypeId: [null],
            name: [null],
            fileName: [null],
            contentType: [null],
            fileSize: [null],
            file: [null],
            fileLocation: [null],
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.customForm.controls; }

    populateForm(data: UserDocument){
        this.customForm.get('documentTypeId').setValue(data.documentTypeId);
        this.customForm.get('name').setValue(data.name);
        this.customForm.get('fileName').setValue(data.fileName);
        this.customForm.get('contentType').setValue(data.contentType);
        this.customForm.get('file').setValue(data.file);
        this.customForm.get('fileLocation').setValue(data.fileLocation);
    }
}