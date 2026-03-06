import {StudentSummaryService} from "./student.service";
import {StudentExtensionFactory} from "./extension.factory";
import {BatchCourseFeeService} from "./batch-course-fee.service";
import {StudentBatchLookupService} from "./api.resolver";

export {StudentSummaryService} from "./student.service";
export {StudentBatchLookupService} from "./api.resolver";

export const STUDENT_SERVICE = [ StudentBatchLookupService, StudentExtensionFactory, StudentSummaryService, BatchCourseFeeService];