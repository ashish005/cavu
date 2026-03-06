import {CoreResource} from "@app-global";


export class OrgBatchLookup extends CoreResource{
    name: string;
    studyModeTypeId: number;
    orgSessionId: number;

    constructor(model: any = <any>{}){
        super();
        this.id = model.id;
        this.name = model.name;
        this.orgSessionId = model.orgSessionId;
        this.studyModeTypeId = model.studyModeTypeId;
    }
}

export class StudyModeTypeLookup {
    id: string;
    name: string;
    parentId: number;
    isDefault: boolean;
    sortOrder: number;

    constructor(model: any = <any>{}){
        this.id = model.id;
        this.name = model.name;
        this.parentId = model.parentId;
        this.isDefault = model.isDefault;
        this.sortOrder = model.sortOrder;
    }
}

export class StudyLevelTypeLookup {
    id: string;
    name: string;

    constructor(model: any = <any>{}){
        this.id = model.id;
        this.name = model.name;
    }
}

export class FeeLookup {
    id: string;
    studyMode: Array<StudyModeTypeLookup> = [];
    studyLevel: Array<StudyLevelTypeLookup> = [];
    batch: Array<OrgBatchLookup>;
    // feeConcession: Array<FeeConcessionTypeLookup>;
    // feePenaltyTypes: Array<PenaltyTypeLookup>;
    reservationCategory: Array<any>;
    constructor(model: any = <any>{}) {
        const {
            studyMode, studyLevel, feeConcession, feePenaltyTypes, reservationCategory, batch
        } = model;

        this.studyMode = (studyMode || []).map(r => new StudyModeTypeLookup(r));
        this.studyLevel = (studyLevel || []).map(r => new StudyLevelTypeLookup(r));

        this.batch = (batch || []).map(r => new OrgBatchLookup(r));
        this.reservationCategory = reservationCategory || [];
        // this.feeConcession = (feeConcession || []).map(r => new FeeConcessionTypeLookup(r));
        // this.feePenaltyTypes = (feePenaltyTypes || []).map(r => new PenaltyTypeLookup(r));
    }
    public getBatchById(batchId: any) { return this.batch.find((r)=> r.id == batchId); }

    // getFeePlanByConcessionType(feeConcessionTypeId: string, feePlan: Array<FeePlanLookup>){
    //     const _feeConcession = (this.feeConcession || []).find((r)=> r.id == feeConcessionTypeId);
    //
    //     if(_feeConcession) {
    //         feePlan.map(r => r.applyConcession(_feeConcession));
    //     }
    //     return feePlan;
    // }
}
export class FeeLookupSerializer {
  fromJson(json: any): FeeLookup {
    return new FeeLookup(json);
  }
  toJson(data: any): any { return {}; }
}
