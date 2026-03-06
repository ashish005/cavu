import {CreateMasterCourseComponent} from "./create-master-course.component";
import {CreateEditSubject} from "./create-edit-subject";
import {CreateEditSection} from "./create-edit-section";
import {EditCourseComponent} from "./edit-course.component";
import {StudyTypeListComponent} from "./study-type-list/study-type-list.component";

export const COURSE_ENTRY_COMPONENTS = [ StudyTypeListComponent ];
export const COURSE_COMPONENTS = [
  StudyTypeListComponent,
  CreateMasterCourseComponent,
  EditCourseComponent,
  CreateEditSection,
  CreateEditSubject
];
