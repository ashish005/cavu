import {
  Component,
  EventEmitter,
  Inject,
  ViewContainerRef,
  ViewChild,
  ComponentFactoryResolver, TemplateRef, Type
} from '@angular/core';
import {CommonModule, DOCUMENT} from "@angular/common";

type Content<T> = string | TemplateRef<T> | Type<T>;

@Component({
  //selector: 'app-popup',
  templateUrl: './templates/popup.html', standalone: true, imports: [CommonModule]
})
export class PopupComponent {
  onOk: EventEmitter<any> = new EventEmitter<any>();
  onCancel: EventEmitter<any> = new EventEmitter<any>();
  private backdrop: HTMLElement;
  style: any;
  bodyClass: any;
  header: {text: string, desc: string};

  @ViewChild('popupBody', { read: ViewContainerRef, static: true }) popupBody: ViewContainerRef;
  footerTemplateRef: TemplateRef<any>;

  constructor(@Inject(DOCUMENT) private document: Document, private resolver: ComponentFactoryResolver) { }

  okClicked = ($event) => {
    this.onOk.emit($event);
  }

  cancelClicked = ($event) => {
    this.onCancel.emit($event);
  }

  show(content: any, input: any = {}, popupOptions) {
    this.document.body.classList.add('modal-open');

    if(!popupOptions.backdropDisabled){
      this.style = { 'display': 'block' };
      this.showBackdrop();
    } else {
      this.style = { 'display': 'contents' };
    }

    //component
    this.popupBody.clear();
    const factory = this.resolver.resolveComponentFactory(content);
    const componentRef: any = this.popupBody.createComponent(factory);
    if(componentRef.instance && componentRef.instance.footerTemplate){
      this.footerTemplateRef = componentRef.instance.footerTemplate;
    }

    Object.assign(componentRef.instance, input, {
      onOk: this.onOk,
      onCancel: this.cancelClicked
    });
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
