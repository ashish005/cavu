import {LicensingFeature} from "./org-license.serializer";

export class PaymentSoftwareLicenseType {
    id: number;
    name:  string;
    sortOrder: number;

    softwareId: number;
    isRecommended: boolean;
    validityIndays: number;

    rate: number;
    discount: number;
    tax: number;
    constructor(model)
    {
        const {
            id, name, sortOrder, softwareId, isRecommended, validityIndays,
            rate, discount, tax,
            paymentAmount, savingsAmount, taxAmount, discountAmount, discountedRate
        } = model;
        this.id = id;
        this.name = name;
        this.sortOrder = sortOrder;
        this.softwareId = softwareId;
        this.isRecommended = isRecommended;
        this.validityIndays = validityIndays;

        this.rate = rate || 0;
        this.discount = discount || 0;
        this.tax = tax || 0;
    }

    paymentAmount=()=> this.rate * (1 - this.discount / 100) * (1 + this.tax / 100);

    savingsAmount=()=> this.rate * (this.discount / 100) * (1 + this.tax / 100);
    taxAmount=()=> this.rate*(1 -  this.discount / 100) * this.tax / 100;

    discountedRate=()=> this.rate*(1 -  this.discount / 100);
}
export class PaymentSoftware {
    id: string;
    name: string;
    description: string;
    licenseTypes: Array<PaymentSoftwareLicenseType>;
    licensingFeatures: Array<LicensingFeature>;

    constructor(model: any = <any>{}){
        const { id, name, description, licenseTypes, licensingFeatures } = model;
        this.id = id;
        this.name = name;
        this.description = description;
        this.licenseTypes = (licenseTypes || []).map(r => new PaymentSoftwareLicenseType(r));
        this.licensingFeatures = (licensingFeatures || []).map(r => new LicensingFeature(r));
    }
}