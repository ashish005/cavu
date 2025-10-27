import {FormArray, FormBuilder, FormGroup} from "@angular/forms";

export class NotificationRecipientForm {
    customForm: FormGroup;
    constructor(public fb: FormBuilder){
        this.customForm = fb.group({
            recipients: fb.array([])
        });
    }
    recipientForm(dataItem: any = {}) : FormGroup {
        return this.fb.group(<any>{
            email: [dataItem.email],
            mobile: [dataItem.mobile],
            userId: [dataItem.userId],
            name: [dataItem.name],
            subject: [dataItem.subject],
            message: [dataItem.message],
            scheduleDeliveryTime: [dataItem.scheduleDeliveryTime],
            isSuccess: [dataItem.isSuccess],
        });
    }

    get f() { return this.customForm.controls; }

    get formRecipients(): FormArray {
        return <FormArray>this.customForm.get('recipients');
    }

    addFormRecipients(data: any){
        this.formRecipients.push(this.recipientForm(data));
    }

    populateFormRecipients(data: Array<any>){
        this.formRecipients.controls.length = 0;
        (data || []).map((r: any) => this.addFormRecipients(r));
    }
}