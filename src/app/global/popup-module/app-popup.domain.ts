import {ASIDE_CLASS, ASIDE_SIZE} from "./app-popup.enum";

export class PopupHeaderDomain {
  text: string;
  desc: string;
  templateRef: any;
  constructor(modal: any = {}){
    const { text, desc, templateRef } = modal;
    this.text = text;
    this.desc = desc;
    this.templateRef = templateRef;
  }
}

export class PopupDomain {
  header: PopupHeaderDomain;
  aside: string;
  size: string;
  popupClass: string;
  bodyClass: string;
  backdropDisabled: boolean;
  constructor(modal: any = {}){

    const { header, aside, size, backdropDisabled, popupClass } = modal;

    this.header = new PopupHeaderDomain(header);
    this.aside = aside || ASIDE_CLASS.CENTER;
    this.size = size || ASIDE_SIZE.W_50;
    this.popupClass = popupClass;
    this.bodyClass = `${aside} ${size}`;
    this.backdropDisabled = backdropDisabled || false;
  }
}
