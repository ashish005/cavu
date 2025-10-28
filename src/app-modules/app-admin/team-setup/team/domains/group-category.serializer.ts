import {CoreQueryOptions, CoreResource} from "@app-global";
import {TeamUserGroup} from "./user-group.serializer";

export class GroupCategoryQueryOptions extends CoreQueryOptions{
    searchAction: string;
    constructor(model: any = {}){
        super(model);
        this.searchAction = model.searchAction || '';
    }

    override toQueryString (){
        const obj = {
            searchAction:this.searchAction
        };
        return super.getParamByObject(obj);
    }
}

export class GroupCategory extends CoreResource {
    //id: string;
    name: string;
    hasDynamicRules: boolean;
    userGroups: Array<TeamUserGroup>;
    constructor(model: any = <any>{}){
        super();
        this.id = model.id;
        this.name = model.name;
        this.hasDynamicRules = model.hasDynamicRules;
        this.userGroups = (model.userGroups || []).map(r => new TeamUserGroup(r));
    }
}

export class GroupCategorySerializer {
    fromJson(json: any): GroupCategory { return new GroupCategory(json); }
    toJson(client: any): any { return client; }
}
