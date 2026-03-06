import {FeeByTypeService} from "./fee-by-type.service";
import {FeeByClassService} from "./fee-by-class.service";
import {FeeByClassSectionService} from "./fee-by-class-section.service";
import {FeeByOrgBatchService} from "./fee-by-org-batch.service";
import {FeeByStudentBatchService} from "./fee-by-student-batch.service";

export const FEE_BY_SERVICES = [
    FeeByTypeService, FeeByClassService, FeeByClassSectionService, FeeByOrgBatchService, FeeByStudentBatchService
];