import {Pipe, PipeTransform} from "@angular/core";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";

@Pipe({
  name: 'prettyprint', pure: true, standalone: true
})
export class PrettyPrintPipe implements PipeTransform {
  transform(value: any): any {
    if(typeof value === 'string') {
     let data = JSON.stringify(JSON.parse(value), undefined, 4);
      return data.replace(/ /g, '&nbsp;').replace(/\n/g, '<br/>');
    }  else if(value)
    return JSON.stringify(value, undefined, 4)
      .replace(/ /g, '&nbsp;')
      .replace(/\n/g, '<br/>');
  }
}
