import {CoreQueryOptions, CoreResource} from "@app-global";

export class ProductCategoryQueryOptions extends CoreQueryOptions{
    productId: string;
    constructor(model: any = {}){
        super(model);
    }

    override toQueryString (){
        const obj = {
            productId: this.productId
        };
        return super.getParamByObject(obj);
    }
}

export class ProductCategory extends CoreResource {
    name: string;
    shortName: string;
    code: string;
    description: string;


    constructor(model: any = <any>{}){
        super();
        const {id, name, shortName, code, description } = model;
        this.id = id;
        this.name = name;
        this.shortName = shortName;
        this.code = code;
        this.description = description;
    }
}

export class ProductCategorySerializer {
    fromJson(json: any): ProductCategory { return new ProductCategory(json); }
    toJson(model: any): any {
        const {id, name, shortName, description} = model;
        return model;
    }
}
