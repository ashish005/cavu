import {Component, ComponentFactoryResolver, EventEmitter, Inject, ViewChild, ViewContainerRef} from "@angular/core";
import {CommonModule, DOCUMENT} from "@angular/common";

@Component({
    selector: 'app-popup-custom',
    templateUrl: './templates/popup-custom.html', standalone: true, imports: [CommonModule]
})
export class PopupCustomComponent {
    onOk: EventEmitter<any> = new EventEmitter<any>();
    onCancel: EventEmitter<any> = new EventEmitter<any>();
    style: any;
    popupClass: any;
    bodyClass: any;
    header: {text: string, desc: string};

    @ViewChild('popupBody', { read: ViewContainerRef, static: true }) popupBody: ViewContainerRef;

    constructor( @Inject(DOCUMENT) private document: Document, private resolver: ComponentFactoryResolver) { }

    okClicked($event) {
        this.onOk.emit($event);
    }

    cancelClicked($event){
        this.onCancel.emit($event);
    }

    show(content: any, input: any = {}, popupOptions) {
        //component
        this.popupBody.clear();
        const factory = this.resolver.resolveComponentFactory(content);
        const componentRef = this.popupBody.createComponent(factory);

        Object.assign(componentRef.instance, input, {
            onOk: this.okClicked,
            onCancel: this.cancelClicked
        });
    }

    hide() {
        this.style = { 'display': 'none' };
        if(this.popupBody){
            this.popupBody.clear();
        }
    }
}
