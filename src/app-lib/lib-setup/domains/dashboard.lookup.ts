export class Dashboard {
    id: number;
    name: string;
    children: Array<ChildSection> = [];

    constructor(model: any = <any>{}) {
        this.id = model.id;
        this.name = model.name;
        this.children = (model.sections).map(r => new ChildSection(r));
    }
}

export class ChildSection {
    id: number;
    name: string;

    constructor(model: any = <any>{}) {
        this.id = model.id;
        this.name = model.name;
    }
}

export class Portlet {
    id: number;
    code: string;
    name: string;
    description: string;
    masterPortletId: number;
    sortOrder: number;
    footer: string;

    constructor(model: any = <any>{}) {
        this.id = model.id;
        this.code = model.code;
        this.name = model.name;
        this.description = model.description || 'Sub title goes here with small font';
        this.masterPortletId = model.masterPortletId;
        this.sortOrder = model.sortOrder;
        this.footer = model.footer || 'Tip: All data calculated in real time';
    }
}

export class DashboardLookup {
    id: any;
    portlet: Array<Portlet> = [];
    portletKeys: any = {};

    constructor(model: any = <any>{}) {
        this.portlet = (model.portlet || []).map(r => new Portlet(r));
        this.portletKeys = (this.portlet || []).reduce((result, curr) => {
            result[curr.code] = curr;
            return result;
        }, {});
    }


    getPortletByKey(key) {
        return this.portletKeys[key] || new Portlet();
    }
}

export class DashboardLookupSerializer {
    fromJson(json: any): DashboardLookup { return new DashboardLookup(json); }

    toJson(data: any): any { return {}; }
}