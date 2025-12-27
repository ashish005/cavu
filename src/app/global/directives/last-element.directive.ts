import { Directive, Input, Output, EventEmitter } from '@angular/core';

@Directive({
    standalone: true,
    selector: '[lastElement]'
})
export class LastElementDirective {
    @Input() set lastElement(isLastElement: boolean) {
        if (isLastElement) {
            setTimeout(() => {
                this.lastFunction.emit();
            });
        }
    }

    @Output() lastFunction = new EventEmitter();
}
