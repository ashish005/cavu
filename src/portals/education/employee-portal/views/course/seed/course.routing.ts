import {RouterModule, Routes} from "@angular/router";
import {SeedCouresView} from "./views/seed-coures.view";
import {CourseSeederAPIResolver} from "./services/api.resolver";

export const CourseSeeder_Routes: Routes = [
    {
        path: '', resolve: {items: CourseSeederAPIResolver},
        children: [
            { path: '', component: SeedCouresView },
            { path: ':key', component: SeedCouresView },
        ]
    }
];
export const COURSE_SEEDER_VIEWS = [ SeedCouresView ];

export const CourseSeederRoute = RouterModule.forChild(CourseSeeder_Routes);
