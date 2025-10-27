class RelationType {
    id: number;
    name: string;
    constructor(model: any = <any>{}){
        const { id, name } = model || {};
        this.id = id;
        this.name = name;
    }
}

class BloodGroupType {
    id: string;
    name: string;

    constructor(model: any = <any>{}){

        this.id = model.id;
        this.name = model.name;
    }
}

class CasteType {
    id: string;
    name: string;

    constructor(model: any = <any>{}){

        this.id = model.id;
        this.name = model.name;
    }
}

class GenderType {
    id: string;
    name: string;

    constructor(model: any = <any>{}){

        this.id = model.id;
        this.name = model.name;
    }
}

class MaritalStatusType {
    id: string;
    name: string;

    constructor(model: any = <any>{}){

        this.id = model.id;
        this.name = model.name;
    }
}

class ReservationCategoryType {
    id: string;
    name: string;

    constructor(model: any = <any>{}){

        this.id = model.id;
        this.name = model.name;
    }
}

class NationalityType {
    id: string;
    name: string;

    constructor(model: any = <any>{}){

        this.id = model.id;
        this.name = model.name;
    }
}

export class ClientLookup {
    id: any;
    bloodGroup: Array<BloodGroupType> = [];
    nationality: Array<NationalityType> = [];
    caste: Array<CasteType> = [];
    gender: Array<GenderType> = [];
    maritalStatus: Array<MaritalStatusType> = [];
    relationTypes: Array<RelationType>;

    constructor(model: any = <any>{}){
        const { bloodGroup, caste, gender, maritalStatus, nationality, relationTypes } = model;
        this.bloodGroup = (bloodGroup || []).map(r => new BloodGroupType(r));
        this.caste = (caste || []).map(r => new CasteType(r));
        this.gender = (gender || []).map(r => new GenderType(r));
        this.maritalStatus = (maritalStatus || []).map(r => new MaritalStatusType(r));
        this.relationTypes = (relationTypes || []).map(r => new RelationType(r));
        this.nationality = (nationality || []).map(r => new NationalityType(r));
    }
}

export class ClientLookupSerializer {
    fromJson(json: any): ClientLookup { return new ClientLookup(json); }
    toJson(data: any): any { return null; }
}