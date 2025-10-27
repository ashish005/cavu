import {
  Injectable,
  ComponentFactoryResolver,
  ViewContainerRef,
  Injector,
  Compiler,
  Inject,
  TemplateRef,
  ComponentRef,
  Type,
  ApplicationRef, EmbeddedViewRef
} from '@angular/core';

import {PopupComponent} from "./components/popup.component";
import {PopupCustomComponent} from "./components/popup-custom.component";
import {PopupNormalComponent} from "./components/popup-normal.component";

import {PopupDomain} from "./app-popup.domain";
import { Observable, throwError } from 'rxjs';

export type Content<T> = string | TemplateRef<T> | Type<T>;

//https://github.com/angular/angular/issues/9293
/**
 * Injection service is a helper to append components
 * dynamically to a known location in the DOM, most
 * noteably for dialogs/tooltips appending to body.
 *
 * @export
 * @class InjectionService
 */
@Injectable({ providedIn: 'root' })
export class PopupService {
  private vcRef: ViewContainerRef;//  No need this
  private _container: ComponentRef<any>;
  private _componentRef: ComponentRef<any>;
  constructor(
    private applicationRef: ApplicationRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector) {
  }

  /**
   * Gets the root view container to inject the component to.
   *
   * @returns {ComponentRef<any>}
   *
   * @memberOf InjectionService
   */
  getRootViewContainer(): ComponentRef<any> {
    if(this._container) return this._container;

    const rootComponents = this.applicationRef['components'];
    if (rootComponents.length) return rootComponents[0];

    throw throwError('View Container not found! ngUpgrade needs to manually set this via setRootViewContainer.');
  }

  /**
   * Overrides the default root view container. This is useful for
   * things like ngUpgrade that doesn't have a ApplicationRef root.
   *
   * @param {any} container
   *
   * @memberOf InjectionService
   */
  setRootViewContainer(container): void {
    this._container = container;
  }

  /**
   * Gets the html element for a component ref.
   *
   * @param {ComponentRef<any>} componentRef
   * @returns {HTMLElement}
   *
   * @memberOf InjectionService
   */
  getComponentRootNode(componentRef: ComponentRef<any>): HTMLElement {
    return (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
  }

  /**
   * Gets the root component container html element.
   *
   * @returns {HTMLElement}
   *
   * @memberOf InjectionService
   */
  getRootViewContainerNode(): HTMLElement {
    return this.getComponentRootNode(this.getRootViewContainer());
  }

  /**
   * Projects the inputs onto the component
   *
   * @param {ComponentRef<any>} component
   * @param {*} options
   * @returns {ComponentRef<any>}
   *
   * @memberOf InjectionService
   */
  projectComponentInputs(component: ComponentRef<any>, options: any): ComponentRef<any> {
    if(options) {
      const props = Object.getOwnPropertyNames(options);
      for(const prop of props) {
        component.instance[prop] = options[prop];
      }
    }

    return component;
  }

  /**
   * Appends a component to a adjacent location
   *
   * @template T
   * @param {Type<T>} componentClass
   * @param {*} [options={}]
   * @param {Element} [location=this.getRootViewContainerNode()]
   * @returns {ComponentRef<any>}
   *
   * @memberOf InjectionService
   */
  appendComponent(componentClass: Type<any>, options: any = {}, location: Element = this.getRootViewContainerNode()): ComponentRef<any> {

    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentClass);
    let componentRef = componentFactory.create(this.injector);
    let appRef: any = this.applicationRef;
    let componentRootNode = this.getComponentRootNode(componentRef);

    // project the options passed to the component instance
    this.projectComponentInputs(componentRef, options);

    // ApplicationRef's attachView and detachView methods are in Angular ^2.2.1 but not before.
    // The `else` clause here can be removed once 2.2.1 is released.
    if (appRef['attachView']) {
      appRef.attachView(componentRef.hostView);

      componentRef.onDestroy(() => {
        appRef.detachView(componentRef.hostView);
      });
    } else {
      // When creating a component outside of a ViewContainer, we need to manually register
      // its ChangeDetector with the application. This API is unfortunately not published
      // in Angular <= 2.2.0. The change detector must also be deregistered when the component
      // is destroyed to prevent memory leaks.
      let changeDetectorRef = componentRef.changeDetectorRef;
      appRef.registerChangeDetector(changeDetectorRef);

      componentRef.onDestroy(() => {
        appRef.unregisterChangeDetector(changeDetectorRef);

        // Normally the ViewContainer will remove the component's nodes from the DOM.
        // Without a ViewContainer, we need to manually remove the nodes.
        if (componentRootNode.parentNode) {
          componentRootNode.parentNode.removeChild(componentRootNode);
        }
      });
    }

    location.appendChild(componentRootNode);

    return componentRef;
  }


  // No need this
  registerViewContainerRef(vcRef: ViewContainerRef): void {
    this.vcRef = vcRef;
  }

  // No need this
  registerInjector(injector: Injector): void {
    this.injector = injector;
  }

  destroy(){
    if(this._componentRef){
      this._componentRef.instance.hide();
      this.applicationRef.detachView(this._componentRef.hostView);
      this._componentRef.destroy();
    }

    if(this.vcRef ){
      this.vcRef.clear();
    }
  }

  showCustom(content: Content<any>, popupOptions?: any,  dataItem?: any) {
    const popupModal = new PopupDomain(popupOptions);
    const data = Object.assign(popupModal, dataItem);
    this._componentRef = this.appendComponent(PopupCustomComponent, data);
    this._componentRef.instance.show(content, data, popupModal);

    //const componentRef = this.appendComponent(PopupCustomComponent, popupInput);
    return new Promise((resolve, reject) => {
      this._componentRef.instance.onOk.subscribe((resp) => {
        return resolve(resp);
      });
      this._componentRef.instance.onCancel.subscribe((resp) => {
        return reject(resp);
      });
    });
  }
  showCustomPopup(content: Content<any>, popupInput?: any,  parameters?: any) {
    const popupModal = new PopupDomain(popupInput);
    const data = Object.assign(popupModal, parameters);
    this._componentRef = this.appendComponent(PopupNormalComponent, data);
    this._componentRef.instance.show(content, parameters, popupModal);
    return new Promise((resolve, reject) => {
      this._componentRef.instance.onOk.subscribe((resp) => {
        return resolve(resp);
      });
      this._componentRef.instance.onCancel.subscribe((resp) => {
        return reject(resp);
      });
    });
  }

  showDynamic(content: Content<any>, popupInput?: any,  parameters?: any) {
    const popupModal = new PopupDomain(popupInput);
    this._componentRef = this.appendComponent(PopupComponent, popupModal);
    Object.assign(this._componentRef.instance, popupModal);
    // to apply modal  css
    this._componentRef.instance.show(content, popupInput, parameters);
    return new Promise((resolve, reject) => {
      this._componentRef.instance.onOk.subscribe((resp) => {
        return resolve(resp);
      });
      this._componentRef.instance.onCancel.subscribe((resp) => {
        return reject(resp);
      });
    });
  }

  show(content: Content<any>, popupInput?: any,  parameters?: any) {
    this.vcRef.clear();
    //component
    const factory = this.componentFactoryResolver.resolveComponentFactory(PopupComponent);
    const componentRef = this.vcRef.createComponent(factory);

    const popupModal = new PopupDomain(popupInput);
    Object.assign(componentRef.instance, popupModal);
    this._componentRef = componentRef;

    this._componentRef.instance.show(content, parameters, popupModal);
    return new Promise((resolve, reject) => {
      this._componentRef.instance.onOk.subscribe((resp) => {
        return resolve(resp);
        /*
          this.componentRef.hide();
          this.componentRef.destroy();
        */
      });
      this._componentRef.instance.onCancel.subscribe((resp) => {
        return reject(resp);
        /*this.componentRef.hide();
        this.vcRef.clear();*/
      });
    });
  }
}
