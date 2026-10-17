import {FormArray, FormBuilder, FormGroup} from "@angular/forms";

export class AddDeleteRow {
  customForm: FormGroup;
  items: FormArray;

  constructor(public formBuilder: FormBuilder) {
    this.customForm = this.formBuilder.group({
      items: this.formBuilder.array([])
    });
  }

  get formData() {
    return <FormArray>this.customForm.get('items');
  }

  update(){
    const data: any = this.formData;
    //this.cb.emit(data.value);
  }

  createItem(): FormGroup {
    return this.formBuilder.group({ name: ' ' });
  }

  addItem(): void {
    this.items = this.formData as FormArray;
    this.items.push(this.createItem());
  }

  removeItem(i: number): void {
    this.items.removeAt(i);
  }
}
