
export class BasicListDomain {
  /** Name of the list */
  private _name:string;
  /** Last element touched */
  last:any;
  /** text filter */
  picker:string;

  dragStart:boolean;
  dragOver:boolean;

  pick:Array<any>;
  list:Array<any>;
  sift:Array<any>;

  constructor(name:string) {
    this._name = name;
    this.last = null;
    this.picker = '';
    this.dragStart = false;
    this.dragOver = false;

    // Arrays will contain objects of { _id, _name }.
    this.pick = [];
    this.list = [];
    this.sift = [];
  }

  get name() : string {
    return this._name;
  }
}

export class DualListfilterButtonsDomain {
  widthClass: string;
  align: string;
  type: string;
  text: string;
  action: any;
  checked: boolean;
  disabledCheck: any;

  constructor(model: any = <any>{}){
    this.widthClass = model.widthClass || '';
    this.align = model.align || '';
    this.type = model.type || 'button';
    this.text = model.text || '';
    this.checked = model.checked || false;
    this.action = model.action;
    this.disabledCheck = model.disabledCheck;
  }
}
