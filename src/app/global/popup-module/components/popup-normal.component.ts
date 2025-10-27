import {
    Component,
    ComponentFactoryResolver,
    EventEmitter,
    Inject,
    TemplateRef,
    ViewChild,
    ViewContainerRef
} from "@angular/core";
import {CommonModule, DOCUMENT} from "@angular/common";

@Component({
    templateUrl: './templates/popup-normal.html', standalone: true, imports: [CommonModule]
})
export class PopupNormalComponent {
    onOk: EventEmitter<any> = new EventEmitter<any>();
    onCancel: EventEmitter<any> = new EventEmitter<any>();
    private backdrop: HTMLElement;
    style: any;
    popupClass: any;
    bodyClass: any;
    header: {text: string, desc: string};

    @ViewChild('popupBody', { read: ViewContainerRef, static: true }) popupBody: ViewContainerRef;
    footerTemplateRef: TemplateRef<any>;
    popupOptionsTemplateRef: TemplateRef<any>;

    constructor(@Inject(DOCUMENT) private document: Document, private resolver: ComponentFactoryResolver) { }

    okClicked = ($event) => {
        this.onOk.emit($event);
    }

    cancelClicked = ($event) => {
        this.onCancel.emit($event);
    }

    show(content: any, input: any = {}, popupOptions) {
        this.document.body.classList.add('modal-open');
        this.popupClass = popupOptions.popupClass;
        if(!popupOptions.backdropDisabled){
            this.style = { 'display': 'block' };
            this.showBackdrop();
        } else {
            this.style = { 'display': 'contents' };
        }
        //component
        this.popupBody.clear();
        const factory = this.resolver.resolveComponentFactory(content);
        const componentRef: any = this.popupBody.createComponent(factory, 0);
        if(componentRef.instance && componentRef.instance.footerTemplate){
            this.footerTemplateRef = componentRef.instance.footerTemplate;
        }

        if(componentRef.instance && componentRef.instance.popupOptionsTemplate){
            this.popupOptionsTemplateRef = componentRef.instance.popupOptionsTemplate;
        }

        Object.assign(componentRef.instance, input, { onOk: this.onOk, onCancel: this.onCancel });
    }

    hide() {
        this.document.body.classList.remove('modal-open');
        this.style = { 'display': 'none' };
        this.hideBackdrop();
        if(this.popupBody){
            this.popupBody.clear();
        }
    }

    showBackdrop() {
        this.backdrop = this.document.createElement('div');
        this.backdrop.classList.add('modal-backdrop');
        this.backdrop.classList.add('show');
        this.document.body.appendChild(this.backdrop);
    }

    hideBackdrop() {
        if(this.backdrop){
            this.backdrop.remove();
        }
    }
}
