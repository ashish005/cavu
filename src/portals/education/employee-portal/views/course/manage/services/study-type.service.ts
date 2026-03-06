import {Injectable, Injector} from "@angular/core";
import {
  StudyLevelType, StudyLevelTypeSerializer,
  StudyStreamType, StudyStreamTypeSerializer,
  StudyProgramType, StudyProgramTypeSerializer,
  StudyDegreeType, StudyDegreeTypeSerializer
} from "../domains/study-type.serializer";

import  { OrgResourceService } from "@app-global";

@Injectable()
export class StudyDegreeTypeService extends OrgResourceService<StudyDegreeType>{
  constructor(public override injector: Injector) { super(injector, 'study-degree', new StudyDegreeTypeSerializer()); }
}

@Injectable()
export class StudyLevelTypeService extends OrgResourceService<StudyLevelType>{
  constructor(public override injector: Injector) { super(injector, 'study-level', new StudyLevelTypeSerializer()); }
}

@Injectable()
export class StudyProgramTypeService extends OrgResourceService<StudyProgramType>{
  constructor(public override injector: Injector) { super(injector, 'study-program', new StudyProgramTypeSerializer()); }
}

@Injectable()
export class StudyStreamTypeService extends OrgResourceService<StudyStreamType>{
  constructor(public override injector: Injector) { super(injector, 'study-stream', new StudyStreamTypeSerializer()); }
}
