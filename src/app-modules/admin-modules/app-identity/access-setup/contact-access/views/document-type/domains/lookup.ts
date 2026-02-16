import {CoreResource} from "@app-global";

export class DocumentCategoryLookup extends CoreResource {
    name: string;
    constructor(model: any = <any>{}){
        super();
        this.id = model.id;
        this.name = model.name;
    }
}

export class DocumentLookup extends CoreResource{
  categories: Array<DocumentCategoryLookup> = [];
  constructor(model: any = <any>{}){
    super();
    const { categories } = model;
    this.categories = (categories || []).map(r => new DocumentCategoryLookup(r));
  }
}

export class DocumentLookupSerializer {
  fromJson(json: any): DocumentLookup { return new DocumentLookup(json); }
  toJson(data: any): any { return {}; }
}

