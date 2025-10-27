export class UserAuditInfo {
    createdBy: string;
    createdDate: string;
    modifiedBy: string;
    modifiedDate: string;

    constructor(model: any = {}) {
        const { createdBy, createdDate, modifiedBy, modifiedDate } = model;
        this.createdBy = createdBy || '';
        this.createdDate = createdDate || '';
        this.modifiedBy = modifiedBy || '';
        this.modifiedDate = modifiedDate || '';
    }
}