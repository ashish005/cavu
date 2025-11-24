export class CalculationTypeLookup {
    id: string;
    name: string;

    constructor(model: any = <any>{}){
        this.id = model.id;
        this.name = model.name;
    }
}

export class TaxRegimeLookup
{
    id: any;
    name: string;
    constructor(model: any = {}){
        const { id, name } = model;
        this.id = id;
        this.name = name;
    }
}

export class OrgTaskConfigLookup {
    id: number;

    name: string;
    remark: string;
    masterType: string;
    taskTypeName: string;

    isManual: boolean;
    isPrimary: boolean;
    orgProcessId: number;
    constructor(model: any = <any>{}){
        const { id, name, remark, masterType, taskTypeName, isManual, isPrimary, orgProcessId } = model;
        this.id = id;
        this.name = name;
        this.remark = remark;
        this.masterType = masterType;
        this.taskTypeName = taskTypeName;
        this.isManual = isManual;
        this.isPrimary = isPrimary;
        this.orgProcessId = orgProcessId;
    }
}