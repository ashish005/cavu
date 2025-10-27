import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

enum DASHBOARD_TYPES {
  OrgSummary = 'OrgSummary',
  RoleSummary = 'RoleSummary',

  CustomerSummary = 'CustomerSummary',
  EmployeeSummary = 'EmployeeSummary',
  PaymentSummary = 'PaymentSummary',
  ExpenseSummary = 'ExpenseSummary',
  ReceiptSummary = 'ReceiptSummary',

  ProjectSummary = 'ProjectSummary',

  OrgMonthlyProfit = 'MonthlyProfit',
  OrgRevenueByProject = 'ProjectRevenue',

  SupportTicketSummary = 'SupportTicketSummary',
  EventCalendarSummary = 'EventCalendarSummary',

  StudentSummary = 'StudentSummary',
  CourseClassFeeSummary = 'CourseClassFeeSummary',
  FeeSummary = 'FeeSummary',
  FeeHeadSummary = 'FeeHeadSummary',
  ExamSummary = 'ExamSummary',
  TeachingRoaster = 'TeachingRoaster',
}

@Component({
  templateUrl: './dashboard.html', standalone: false
})
export class DashboardView implements OnInit {
  title: string;
  portletKeys: any;

  constructor(private activatedRoute: ActivatedRoute) {
      this.title = this.activatedRoute.snapshot.data['title'];
      this.portletKeys = [];// apiResolver.masterType.portletKeys; public apiResolver: DashboardAPIResolver,
  }

    get hasOrgSummary() { return this.portletKeys[DASHBOARD_TYPES.OrgSummary]; }

    get hasRoleSummary() { return this.portletKeys[DASHBOARD_TYPES.RoleSummary]; }

    get hasOrgMonthlyProfit() { return this.portletKeys[DASHBOARD_TYPES.OrgMonthlyProfit]; }

    get hasEmployeeSummary() { return this.portletKeys[DASHBOARD_TYPES.EmployeeSummary]; }

    get hasPaymentSummary() { return this.portletKeys[DASHBOARD_TYPES.PaymentSummary]; }

    get hasSupportTicketSummary() { return this.portletKeys[DASHBOARD_TYPES.SupportTicketSummary]; }
    get hasEventCalendarSummary() { return this.portletKeys[DASHBOARD_TYPES.EventCalendarSummary]; }

    get hasStudentSummary() { return this.portletKeys[DASHBOARD_TYPES.StudentSummary]; }
    get hasCourseClassFeeSummary() { return this.portletKeys[DASHBOARD_TYPES.CourseClassFeeSummary]; }
    get hasFeeSummary() { return this.portletKeys[DASHBOARD_TYPES.FeeSummary]; }
    get hasFeeHeadSummary() { return this.portletKeys[DASHBOARD_TYPES.FeeHeadSummary]; }
    get hasExamSummary() { return this.portletKeys[DASHBOARD_TYPES.ExamSummary]; }
    get hasTeachingRoaster() { return this.portletKeys[DASHBOARD_TYPES.StudentSummary]; }

    // this.hasCustomerSummary = this.portletKeys[DASHBOARD_TYPES.CustomerSummary];
    // this.hasProjectSummary = this.portletKeys[DASHBOARD_TYPES.ProjectSummary];
    // this.hasPaymentSummary = this.portletKeys[DASHBOARD_TYPES.PaymentSummary];
    // this.hasExpenseSummary = this.portletKeys[DASHBOARD_TYPES.ExpenseSummary];
    // this.hasReceiptSummary = this.portletKeys[DASHBOARD_TYPES.ReceiptSummary];

  ngOnInit(){
    //this.apiResolver.resolve(this.activatedRoute.snapshot);
  }
}
