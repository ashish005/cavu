import {PipeTransform, Pipe} from '@angular/core';

@Pipe({ name: 'highlight', pure: true, standalone: true })
export class HighlightPipe implements PipeTransform {
  transform(text: string, search: any): string {
    if(Array.isArray(search)){
      for (var i = 0; i < search.length; i++) {
        text = this.HighlightPipeReplace(text, search[i]);
      }
    }
    if(typeof search ==='string') {
      text = this.HighlightPipeReplace(text, search);
    }
    return text;

  }

  HighlightPipeReplace(text, search) {
    var pattern = search.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    pattern = pattern.split(' ').filter((t) => { return t.length > 0; }).join('|');

    var regex = new RegExp(pattern, 'gi');

    return search ? text.replace(regex, (match) => `<span class="highlight">${match}</span>`) : text;
  }
}
