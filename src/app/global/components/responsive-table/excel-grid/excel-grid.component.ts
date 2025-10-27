import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import {CommonModule} from "@angular/common";
import {TableComponent} from "../table.component";
declare var XLSX: any;

@Component({
  selector: 'excel-grid',
  templateUrl: './excel-grid.html',
  styleUrls: ['./excel-grid.css'], standalone: true, imports: [CommonModule, TableComponent]
})
export class ExcelGridComponent {
  gridOptions: any = {
    columnDefs: []
  };
  data: Array<any> = [];

  reset (){
    this.data = [];
    this.gridOptions.columnDefs = [];
  }

  file:any;
  // fileChanged(changeEvent) {
  //   this.file = changeEvent.target.files[0];
  //
  //   let reader = new FileReader();
  //   reader.onload = this.loadExcelData.bind(this, changeEvent);
  //
  //   reader.readAsBinaryString(changeEvent.target.files[0]);
  // }
  //
  // loadExcelData(evt) {
  //   var data = evt.target.result;
  //
  //   var workbook = XLSX.read(data, {type: 'binary'});
  //
  //   var headerNames = XLSX.utils.sheet_to_json( workbook.Sheets[workbook.SheetNames[0]], { header: 1 })[0];
  //
  //   var data = XLSX.utils.sheet_to_json( workbook.Sheets[workbook.SheetNames[0]]);
  //
  //   this.opts.columnDefs = [];
  //   headerNames.forEach(function (h) {
  //     this.opts.columnDefs.push({ field: h });
  //   });
  //
  //   this.opts.data = data;
  //
  //   //$elm.val(null);
  // }

  formGroup = this.fb.group({
    file: [null, Validators.required]
  });

  constructor(private fb: FormBuilder, private cd: ChangeDetectorRef) {}

  onFileChange(event) {
    let reader = new FileReader();

    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () =>{
        this.loadExcelData(event, reader.result);
      };
      this.cd.markForCheck();
    }

  }

  loadExcelData(evt, data) {
      var _comma = data.indexOf(","), _b64 = data.substr(0, _comma).indexOf("base64") > -1;
      var workbook = XLSX.read(data.substr(_comma + 1), {type: _b64 ? 'base64' : 'binary'});

      var headerNames = XLSX.utils.sheet_to_json( workbook.Sheets[workbook.SheetNames[0]], { header: 1 })[0];

      var data = XLSX.utils.sheet_to_json( workbook.Sheets[workbook.SheetNames[0]]);

      this.data = [];
      this.gridOptions.columnDefs = [];
      headerNames.forEach((h)=> {
        this.gridOptions.columnDefs.push({ field: h });
      });

      this.data = data;
    }

  actionCb($event){}

  updateGrid($event){}
}
