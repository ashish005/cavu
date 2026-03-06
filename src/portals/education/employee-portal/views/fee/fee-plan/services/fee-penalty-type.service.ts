import  { OrgResourceService } from "@app-global";
import {Injectable, Injector} from "@angular/core";
import {catchError, tap, throwError} from "rxjs";
import {FeePenaltyType, FeePenaltyTypeSerializer} from "../domains/fee-penalty-type.serializer";

@Injectable()
export class FeePenaltyTypeService extends OrgResourceService<FeePenaltyType> {
  constructor(public override injector: Injector) { super(injector, 'feePenalityType', new FeePenaltyTypeSerializer()); }
}
