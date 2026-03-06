import  { OrgResourceService } from "@app-global";
import {Injectable, Injector} from "@angular/core";
import {
  StudyBoardType,
  StudyBoardTypeSerializer,
  StudyModeType,
  StudyModeTypeSerializer
} from "../domains/study-type.serializer";

@Injectable()
export class StudyBoardTypeService extends OrgResourceService<StudyBoardType>{
    constructor(public override injector: Injector){ super(injector, 'study-board', new StudyBoardTypeSerializer()); }
}

@Injectable()
export class StudyModeTypeService extends OrgResourceService<StudyModeType>{
    constructor(public override injector: Injector){ super(injector, 'study-mode', new StudyModeTypeSerializer()); }
}
