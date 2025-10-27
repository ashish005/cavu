import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {catchError, switchMap, tap, debounceTime, of} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'particular-search',
  templateUrl: './particular-search.html',
  styles: [`
      input#search {
          color: inherit;
          padding: 12px 10px;
          width: 60vw;
          border-top-right-radius: 5px;
          border-top-left-radius: 5px;
          border: none;
          outline: none;
      }

      ul {
          background: #fff;
          border-bottom-right-radius: 5px;
          border-bottom-left-radius: 5px;
         /* height: 0;*/
          overflow: hidden;
          box-shadow: 1px 2px 5px rgba(0,0,0,0.2);
          transition: .4s height;
          padding-left: 0px;
      }

      ul li {
          font-size: 13px;
          padding: 4px;
          list-style: none;
          border-top: 1px solid #ddd;
      }

      .match {
          font-weight: 600;
      }

      @media only screen and (min-width: 600px) {
          input#search {
              width: 40vw;
          }
      }
  `], standalone: false
})
export class ParticularSearch implements OnInit {
  @Input() customForm: FormGroup;
  @Input() url: string;

  @Output() cb: EventEmitter<any> = new EventEmitter<any>();
  particularsSearch = new FormControl();
  particularFocus: boolean = false;
  particular$: Array<any>;

  constructor(public httpClient: HttpClient) {}

  ngOnInit(){
    this.particularsSearch.valueChanges.pipe(
      debounceTime(200),
      switchMap(particulars => {
        return (particulars.length >= 2 && this.particularFocus) ? this.fetchByParticularName(particulars):of({entities: []});
      })
    ).subscribe(res => {
      this.particularFocus = true;
      this.particular$ = (res['entities'] || []).map(r => r);
    });

    this.particularsSearch.setValue(this.customForm.get('head').value);
  }

  applySelect(data: any) {
    this.particularFocus = false;
    this.particularsSearch.setValue(data.name, { emitEvent: false });
    this.cb.emit(data);
  }

  fetchByParticularName( name: string){
    return this.httpClient.get(`${this.url}/${name}`);
  }
}
