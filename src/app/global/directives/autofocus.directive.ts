import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({ standalone: true, selector: '[appAutofocus]' })
export class AutofocusDirective implements OnInit {
    constructor(public elementRef: ElementRef) { }

    ngOnInit() {
        setTimeout(() => this.elementRef.nativeElement.focus(), 500);
    }
}