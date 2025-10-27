import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {DashboardAPIResolver, DashboardLookup} from "@app-global";
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
};

@Component({
    templateUrl: './dashboard.html', standalone: false
})
export class DashboardView implements OnInit {
    title: string;
    portletKeys: any = [];
    public masterType: DashboardLookup;
    constructor(private activatedRoute: ActivatedRoute) {
        this.title = this.activatedRoute.snapshot.data['title'];
        //this.portletKeys = apiResolver.masterType.portletKeys;
    }

    get hasOrgSummary() {
        return this.portletKeys[DASHBOARD_TYPES.OrgSummary];
    }

    get hasRoleSummary() {
        return this.portletKeys[DASHBOARD_TYPES.RoleSummary];
    }

    get hasOrgMonthlyProfit() {
        return this.portletKeys[DASHBOARD_TYPES.OrgMonthlyProfit];
    }

    get hasOrgRevenueByProject() {
        return this.portletKeys[DASHBOARD_TYPES.OrgRevenueByProject];
    }

    get hasEmployeeSummary() {
        return this.portletKeys[DASHBOARD_TYPES.EmployeeSummary];
    }

    get hasPaymentSummary() {
        return this.portletKeys[DASHBOARD_TYPES.PaymentSummary];
    }

    get hasSupportTicketSummary() {
        return this.portletKeys[DASHBOARD_TYPES.SupportTicketSummary];
    }

    get hasEventCalendarSummary() {
        return this.portletKeys[DASHBOARD_TYPES.EventCalendarSummary];
    }

    ngOnInit() {
        //this.apiResolver.resolve(this.activatedRoute.snapshot);
      // Subscribe to the resolved data
      this.activatedRoute.data.subscribe(data => {
        const { portletKeys } = (<any>data).lookups;
        this.portletKeys = portletKeys; // 'resolvedData' should match the key in your router config
      });
    }
}
