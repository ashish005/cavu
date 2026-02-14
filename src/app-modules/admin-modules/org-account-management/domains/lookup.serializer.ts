import {CoreResource} from "@app-global";

export class CoreAccountGroupLookup {
    id: number;
    name: string;
    isHighPriority: boolean;
    isNominalGroup: boolean;
    parentGroupId: number;
    accountNatureId: number;
    accountCount: number;
    isLocked: boolean;
    status: string;
    sortOrder: number;
    children: Array<CoreAccountGroupLookup>;
    css: string;

    constructor(model: any = <any>{}){
        const { id, name, isHighPriority, isNominalGroup, parentGroupId, accountNatureId, accountCount, isLocked, status, sortOrder, children } = model;
        this.id = id;
        this.name = name;
        this.isHighPriority = isHighPriority;
        this.isNominalGroup = isNominalGroup;
        this.parentGroupId = parentGroupId;
        this.accountNatureId = accountNatureId;
        this.accountCount = accountCount;
        this.isLocked = isLocked;
        this.status  =  status;
        this.sortOrder =  sortOrder;
        this.children = (children || []).map((r)=> new CoreAccountGroupLookup(r));

        let arr = [];
        if(this.isNominalGroup) { arr.push('b-l b-l-warning');}
        if(this.isHighPriority) { arr.push('b-r b-r-success');}
        this.css = arr.join(' ');
    }
}

export class CoreAccountNatureLookup {
    id: any;
    name: string;
    masterType: string;
    constructor(model: any = {}){
        const {id, name, masterType} = model;
        this.id = id;
        this.name = name;
        this.masterType = masterType;
    }
}

export class CoreAccountLookup extends CoreResource {
    isLoading: boolean;
    natures: Array<CoreAccountNatureLookup>;
    groups: Array<CoreAccountGroupLookup>;
    constructor(model?)
    {
        super();
        const { groups, natures } = model || {};
        this.groups = (groups || []).map(r=> new CoreAccountGroupLookup(r));
        this.natures = (natures || []).map(r => new CoreAccountNatureLookup(r));
    }

    groupsByNature(natureId){ return this.groups.filter((r)=> r.accountNatureId === natureId); }

    getAllAccountGroup(){
        const arr = (result, curr) => {
            (curr.children || []).map(f => {
                arr(result, f);
            });
            result.push(curr);
            return result;
        };
        return this.groups.reduce(arr, []);
    }
}

export class CoreAccountLookupSerializer {
    fromJson(json: any): CoreAccountLookup { return new CoreAccountLookup(json); }
    toJson(data: any): any { return data; }
}
