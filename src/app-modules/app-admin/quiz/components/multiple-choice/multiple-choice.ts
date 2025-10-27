import {ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output} from "@angular/core";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'multiple-choice',
  templateUrl: './multiple-choice.html'
})
export class MultipleChoiceComponent implements OnChanges {
  @Input() qPerms: any;
  @Input() qItem: any;

  @Input() editData: Array<any> = [];
  @Output() cb: EventEmitter<any> = new EventEmitter<any>();
  customForm: FormGroup;
  items: FormArray;

  constructor(private formBuilder: FormBuilder, private cd: ChangeDetectorRef) {
    this.customForm = this.formBuilder.group({
      items: this.formBuilder.array([])
    });
  }

  get formData() {
    return <FormArray>this.customForm.get('items');
  }

  update(){
    const data: any = this.customForm.get('items');
    this.cb.emit(data.value);
  }

  ngOnChanges() {
    this.formData.controls.length = 0;
    //const _custom = this.formBuilder.array([]);
    this.editData.forEach((data: any)=>{
        this.formData.controls.push(this.populateSections(data));
    });
    // this.items = _custom;
    // this.customForm.controls['items'] = _custom;
  }

  populateSections(data: any): FormGroup {
    return this.formBuilder.group({ id: data.id ,name: data.name });
  }

  createItem(): FormGroup {
    return this.formBuilder.group({ name: ' ' });
  }

  addItem(): void {
    this.items = this.customForm.get('items') as FormArray;
    this.items.push(this.createItem());
  }

  removeItem(i: number): void {
    this.items.removeAt(i);
  }
}
