import {Injectable, Injector} from '@angular/core';
import  { CoreResourceService } from "@app-global"
import {ContractorPayment, ContractorPaymentSerializer} from "../domains/contractor-payment.serializer";
import {Contractor, ContractorSerializer} from "../domains/contractor.serializer";

@Injectable()
export class ContractorService extends CoreResourceService<Contractor>{
    constructor(public override injector: Injector) { super(injector, 'contractor', new ContractorSerializer()); }
}

@Injectable()
export class ContractorPaymentService extends CoreResourceService<ContractorPayment>{
    constructor(public override injector: Injector) { super(injector, 'contractorPayment', new ContractorPaymentSerializer()); }
}
