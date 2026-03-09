import {ChangeDetectorRef, Component, Injector, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {AppPermissionService, EMPLOYEE_COMMON_ROUES, OrgLookup, OrgLookupService} from "@app-global";

@Component({
    templateUrl: './templates/layout.html', standalone: false
})
export class Layout implements OnInit {
    /*public navList: Array<any> = this.permService.getEmployeeNavList([
        {
            isFLatChildren: true, key: 'mainLayout.heading.main',
            children: [
                {routeTo: ['dashboard'], icon: "fa fa-dashboard", key: 'mainLayout.dashboard'},
                {routeTo: ['student/fee'], icon: "fa fa-dashboard", key: 'mainLayout.edu.fee'},
                {routeTo: ['course'], icon: "fa fa-dashboard", key: 'mainLayout.edu.course'},
                {routeTo: ['class'], icon: "fa fa-dashboard", key: 'mainLayout.edu.class'},
                {routeTo: ['fee-plan'], icon: "fa fa-group", code: "EMP", key: 'mainLayout.edu.plan'}
            ]
        },
        {
            isFLatChildren: false, key: 'mainLayout.heading.contact',
            children: [
                {routeTo: ['org-emp'], icon: "fa fa-group", code: "EMP", key: 'mainLayout.user.employee'},
                {routeTo: ['student'], icon: "fa fa-group", code: "EMP", key: 'mainLayout.user.student'}
            ]
        },
        /!*{
            name: "Teacher", isFLatChildren: false, key: 'layout.ims.teacher',
            children:[
                { routeTo: ['student-fee/enrolled/trxn-report'], icon:"fa fa-folder-open", code: 'FEE_TRXN_REPORT', name: "Online Trxn Report", key: 'layout.ims.trxn_report' },
                { routeTo: ['syllabus/home-work'], icon:"fa fa-money", code:'ORG_HOME_WRK', name: "Student's Home-work", key: 'layout.ims.student_home_work' },
                { routeTo: ['event'], icon:"fa fa-history", code: "EVENT", name: "Event", key: 'layout.event' },
                { routeTo: ['event/attendance'], icon:"fa fa-university", code:'ORG_ATTENDNC', name: "Attendance", key: 'layout.attendance' },
                { routeTo: ['syllabus'], icon:"fa fa-envelope-open", code:'ORG_SYLL_TIMETBL',  name: "Syllabus & TimeTable", key: 'layout.ims.syllabus_timeTable' },
                { routeTo: ['leave'], icon:"fa fa-envelope-open", code:'LEAVE',  name: "Leave", key: 'layout.leave' },
                { routeTo: ['id-card'], icon:"fa fa-id-card", name: "Id card", key: 'layout.id_card' },
            ]
        },*!/
    ]);*/

    public navList: Array<any> = [
    {
      isFLatChildren: true, key: 'mainLayout.heading.main',
      children: [
        {routeTo: ['dashboard'], icon: "fa fa-dashboard", key: 'Dashboard'},
        {routeTo: ['student/fee'], icon: "fa fa-dashboard", key: 'Fee'},
        {routeTo: ['course'], icon: "fa fa-dashboard", key: 'Course'},
        {routeTo: ['class'], icon: "fa fa-dashboard", key: 'Class'},
        {routeTo: ['fee-plan'], icon: "fa fa-group", code: "EMP", key: 'Plan'}
      ]
    },
    {
      isFLatChildren: false, key: 'mainLayout.heading.contact',
      children: [
        {routeTo: ['org-emp'], icon: "fa fa-group", code: "EMP", key: 'Employee'},
        {routeTo: ['student'], icon: "fa fa-group", code: "EMP", key: 'Student'}
      ]
    },
    ...EMPLOYEE_COMMON_ROUES
    /*{
        name: "Teacher", isFLatChildren: false, key: 'layout.ims.teacher',
        children:[
            { routeTo: ['student-fee/enrolled/trxn-report'], icon:"fa fa-folder-open", code: 'FEE_TRXN_REPORT', name: "Online Trxn Report", key: 'layout.ims.trxn_report' },
            { routeTo: ['syllabus/home-work'], icon:"fa fa-money", code:'ORG_HOME_WRK', name: "Student's Home-work", key: 'layout.ims.student_home_work' },
            { routeTo: ['event'], icon:"fa fa-history", code: "EVENT", name: "Event", key: 'layout.event' },
            { routeTo: ['event/attendance'], icon:"fa fa-university", code:'ORG_ATTENDNC', name: "Attendance", key: 'layout.attendance' },
            { routeTo: ['syllabus'], icon:"fa fa-envelope-open", code:'ORG_SYLL_TIMETBL',  name: "Syllabus & TimeTable", key: 'layout.ims.syllabus_timeTable' },
            { routeTo: ['leave'], icon:"fa fa-envelope-open", code:'LEAVE',  name: "Leave", key: 'layout.leave' },
            { routeTo: ['id-card'], icon:"fa fa-id-card", name: "Id card", key: 'layout.id_card' },
        ]
    },*/
  ];

    orgLookup: OrgLookup;
    constructor(public router: Router, public activatedRoute: ActivatedRoute, public cdref: ChangeDetectorRef,
                public permService: AppPermissionService, public lookupService: OrgLookupService){
        this.orgLookup = this.lookupService.getOrgLookup();
    }

    ngOnInit() {}
    onActivate(componentRef) {}
    ngAfterContentChecked() { this.cdref.detectChanges(); }

    routeToUrl=(path)=> this.router.navigate([path], {relativeTo: this.activatedRoute});
}
