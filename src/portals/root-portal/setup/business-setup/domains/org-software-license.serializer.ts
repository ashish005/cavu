export class SoftwareFeatureValue {
    id: number;
    licenseTypeId: number;
    licenseType: string;
    value: string;
    sortOrder: number;
    constructor(model: any = <any>{}){
        const { id, value, licenseTypeId, licenseType, sortOrder } = model;
        this.id = id;
        this.value = value;
        this.licenseTypeId = licenseTypeId;
        this.licenseType = licenseType;
        this.sortOrder = sortOrder;
    }
}

export class SoftwareFeature {
    id: string;
    name: string;
    description: string;
    sortOrder: number;
    values: Array<SoftwareFeatureValue>;

    constructor(model: any = <any>{}){
        const { id, name, description, sortOrder, values } = model;
        this.id = id;
        this.name = name;
        this.description = description;
        this.sortOrder = sortOrder;
        /*const temp = (softwareLicenseFeatures || []).reduce(
            (prev, next) => {
                prev[`${id}${next.licenseTypeId}`] = next;
                return prev
            },
            {}
        );
        this.softwareLicenseFeatures = temp;*/
        this.values = (values || []).map((r: any) => new SoftwareFeatureValue(r));
    }
}

export class SoftwarePlan {
    id: number;
    name: string;
    sortOrder: number;
    isRecommended: boolean;
    constructor(model: any = <any>{}){
        const { id, name, sortOrder, isRecommended } = model || {};
        this.id = id;
        this.name = name;
        this.sortOrder = sortOrder;
        this.isRecommended = isRecommended
    }
}

export class SoftwarePrice {
    id: string;
    name: string;
    code: string;
    description: string;
    plans: Array<SoftwarePlan>;
    features: Array<SoftwareFeature>;

    constructor(model: any = <any>{}){
        const { id, name, code, description, plans, features } = model;
        this.id = id;
        this.name = name;
        this.code = code;
        this.description = description;
        this.plans = (plans || []).map((r: any) => new SoftwarePlan(r));
        this.features = (features || []).map((r: any) => new SoftwareFeature(r));
    }
}

export class SoftwarePriceSerializer {
    fromJson(json: any): SoftwarePrice {
        return new SoftwarePrice(json);
    }
    toJson(data: any): any {
        return data;
    }
}