import {Component, EventEmitter, Input, Output} from "@angular/core";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

@Component({
    selector: 'date-format-option',
    templateUrl: './templates/date-format-option.html',
  standalone: true, imports: [CommonModule, ReactiveFormsModule]
})
export class DateFormatOptionComponent {
    dateFormatList: Array<any> = [
        {id: 'dd MMM yyyy: ', name: 'dd MM yyyy Like 16 Feb 2022' },
        {id: 'MM dd yyyy:/', name: 'MM dd yyyy Like 02/16/2022'},
        {id: 'MM dd yyyy:.', name: 'MM dd yyyy Like 02/16/2022'},
        {id: 'MM dd yyyy:-', name: 'MM dd yyyy Like 02/16/2022'},
        {id: 'M d yy:/', name: 'M d yy Like 2/16/22'},
        {id: 'M d yy:.', name: 'M d yy Like 2/16/22'},
        {id: 'M d yy:-', name: 'M d yy Like 2/16/22'},
        {id: 'MMM d, y: ', name: 'MMM d, y Like Jun 15, 2015'},
        {id: 'd MMM, y: ', name: 'd MMM, y Like 15 Jun, 2015'}
    ];
    @Input() customForm: FormGroup;
    @Input() title: string;
    @Input() selected: string;
    @Input() disabled?: boolean = false;

    @Output() cb: EventEmitter<string> = new EventEmitter<string>();

    submitted: boolean = false;
    constructor(public fb: FormBuilder){}

    onChange(e) {
        const sp = (e || '').split(':');
        this.formDateFormat.setValue(sp[0]);
        this.formDateSeperator.setValue(sp[1]);
    }
  onDateFormatChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.onChange(value); // or handle it directly
  }

    get formDateFormat() { return <FormGroup>this.customForm.get('dateFormat'); }
    get formDateSeperator() { return <FormGroup>this.customForm.get('dateSeparator'); }

    // convenience getter for easy access to form fields
    get f() { return this.customForm.controls; }
}
