export class ProjectStatus {
    id: any;
    name: string;
    sortOrder: string;
    constructor(model: any = {}){
        const {id, name, sortOrder} = model;
        this.id = id;
        this.name = name;
        this.sortOrder = sortOrder;
    }
}


export class ProjectStatusSerializer {
    fromJson(json: any): ProjectStatus { return new ProjectStatus(json); }
    toJson(model: any): any {
        const {
            name, shortName, description,
            expectedStartDate, expectedDurationDays, expectedCost,
            divisionId, billingTypeId, code, projectTypeId,
            customerId, managerId,
            startDate, endDate,
            hasMultiModule, hasWorkFlow
        } = model;
        return {
            name: name,
            shortName: shortName,
            code: code,
            description: description,
            expectedStartDate: expectedStartDate,
            expectedDurationDays: expectedDurationDays,
            expectedCost: expectedCost,

            customerId: customerId,
            managerId: managerId,

            divisionId: divisionId,
            projectTypeId: projectTypeId,
            billingTypeId: billingTypeId,

            startDate: startDate,
            endDate: endDate,

            hasMultiModule: hasMultiModule,
            hasWorkFlow: hasWorkFlow
        };
    }
}