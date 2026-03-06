import {StudentService} from "./student.service";
import {StudentBatchService} from "./student-batch.service";
import {StudentDocumentService} from "./student-document.service";
import {StudentAPIResolver} from "./api.resolver";

export {StudentService} from "./student.service";
export {StudentBatchService} from "./student-batch.service";
export {StudentDocumentService} from "./student-document.service";
export {StudentAPIResolver} from "./api.resolver";

export const SUB_STUDENT_SERVICE = [
    StudentAPIResolver,
    StudentService, StudentBatchService, StudentDocumentService
];