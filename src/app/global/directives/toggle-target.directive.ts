import {Directive, HostListener, Input} from '@angular/core';

@Directive({
  standalone: true,
  selector: '[toggleTarget]'
})
export class ToggleTargetDirective {
  @Input() target: string;

  @HostListener('click', ['$event.target']) onClick(e: any) {
    const el: any = document.querySelector(this.target);
    if(el.classList.contains('show')){
      el.classList.remove('show');
      //el.style.display = 'none';
    } else {
      el.classList.add('show');
      //el.style.display = 'block';
    }
  }
}
