import {HttpParams} from "@angular/common/http";

class CorePageResponse<T>{
  hasNext:boolean;
  hasPrevious: boolean;
  count: number;
  entities: T[];
  data: any;

  constructor(model: any = {}){
    this.hasNext = model.hasNext;
    this.hasPrevious = model.hasPrevious;
    this.count = model.count;
    this.entities = model.entities;
    this.data = model.data;
  }
}

export class CoreFilter {
  key: string;
  operator: string;
  value: any;
  constructor(key: string, operator: string, value: any){
    this.key = key;
    this.operator = operator;
    this.value = value;
  }

  getFilter(){
    return `${ this.key + this.operator + this.value }`;
  }
}

class Sort {
  field: string;
  direction: string;
  constructor(public sortField: string, public order: string) {
    this.field = sortField;
    this.direction = order || '1';
  }

  toString() {
    return `${this.sortField},${this.direction}`;
  }
}

export class CoreResource {
  id: any;
}

export class CoreQueryOptions{
  public page: number = 1;
  public skip: number;
  public take: number;
  filter: Array<any>;
  sortCriteria: Array<Sort>;

  constructor(model: any = {}){
    this.skip = model.skip || 0;
    this.take = model.take || 25;
    this.filter = model.filter || [];
    this.sortCriteria = model.sortCriteria || [new Sort('modifiedDate', '1')];
  }

  getCoreFilters(){
    return this.filter.map((r)=> r.toString()).join('&');
  }

  public toQueryString (){
    const _filter = this.getCoreFilters().toString();
    const _sortCriteria = `createdDate desc`;

    let params = new HttpParams()
    .set('skip', this.skip.toString())
    .set('take', this.take.toString())
    //.set('includeProperties',  "id, name");
    .set('filter', this.filter.toString())
    .set('sortCriterias', _sortCriteria);
    return params;
  }

  getParamByObject(obj: any = {}){
    obj.skip = this.skip.toString();
    obj.take = this.take.toString();
    //obj.sortCriterias = this.sortCriteria.toString();
    return Object.keys(obj).filter(r=> obj[r]).reduce((p, key) => p.set(key, obj[key]), new HttpParams());
  }
}

export interface CoreSerializer {
  fromDataJson?(json: any): any;
  fromJson(json: any): CoreResource;
  toJson(resource: CoreResource): any;
}

export class CoreResponse<T> extends CorePageResponse<T>{
  isSuccess: boolean;
  message: string;
  constructor(model: any = {}){
    super(model);
    this.isSuccess = model.isSuccess || false;
    this.message = model.message || "";
  }
}
