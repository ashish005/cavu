import {Injectable, Injector} from "@angular/core";
import  { OrgResourceService } from "@app-global";
import {ErrorLog, ErrorLogSerializer} from "../domains/error-log.serializer";
import {DataLog, DataLogSerializer} from "../domains/data-log.serializer";
import {OrgTaskLog, OrgTaskLogSerializer} from "../domains/org-task-log.serializer";

@Injectable()
export class ErrorLogService extends OrgResourceService<ErrorLog> {
  constructor(public override injector: Injector) { super(injector, 'errorlog', new ErrorLogSerializer()); }
}

@Injectable()
export class DataLogService extends OrgResourceService<DataLog> {
  constructor(public override injector: Injector) { super(injector, 'datalog', new DataLogSerializer()); }
}

@Injectable()
export class OrgTaskLogService extends OrgResourceService<OrgTaskLog> {
  constructor(public override injector: Injector) { super(injector, 'orgtasklog', new OrgTaskLogSerializer()); }
}
