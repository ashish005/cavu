import {Component, ElementRef, Input, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {DateHelper} from "../../helpers";
import {CalendarYearMonthDayComponent} from "./calendar-year-month-day.component";
import {CommonModule} from "@angular/common";
@Component({
    selector: 'calendar-year',
    templateUrl: `./templates/calendar-year.html`,
    styles: [`
    .calendar {
      padding: 4px;
      -webkit-border-radius: 4px;
      -moz-border-radius: 4px;
      border-radius: 4px;
      overflow: auto;
      direction: ltr;
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -khtml-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none
    }

    .calendar.calendar-rtl {
      direction: rtl
    }

    .calendar.calendar-rtl table tr td span {
      float: right
    }

    .calendar table {
      margin: auto;
    }

    .calendar table td,.calendar table th {
      text-align: center;
      width: 20px;
      height: 20px;
      border: none;
      padding: 4px 5px;
      font-size: 12px
    }

    .calendar .calendar-header {
      width: 100%;
      margin-bottom: 20px
    }

    .calendar .calendar-header table {
      width: 100%
    }

    .calendar .calendar-header table th {
      font-size: 22px;
      padding: 5px 10px
    }

    .calendar .calendar-header table th:hover {
      background: #eee;
      cursor: pointer
    }

    .calendar .calendar-header table th.disabled,.calendar .calendar-header table th.disabled:hover {
      background: 0 0;
      cursor: default;
      color: #fff
    }

    .calendar .calendar-header table th.next,.calendar .calendar-header table th.prev {
      width: 20px
    }

    .calendar .year-title {
      font-weight: 700;
      text-align: center;
      height: 20px;
      width: auto
    }

    .calendar .year-neighbor {
      color: #aaa
    }

    .calendar .year-neighbor2,.calendar table.month tr td.disabled,.calendar table.month tr td.disabled:hover {
      color: #ddd
    }

    .calendar .months-container {
      width: 100%;
      display: none
    }

    .calendar .month-container {
      min-width: 180px;
      text-align: center;
      padding: 0;
      float: left;
      font-size: .7rem;
    }

    .calendar .round-left {
      -webkit-border-radius: 8px 0 0 8px;
      -moz-border-radius: 8px 0 0 8px;
      border-radius: 8px 0 0 8px
    }

    .calendar .round-right {
      webkit-border-radius: 0 8px 8px 0;
      -moz-border-radius: 0 8px 8px 0;
      border-radius: 0 8px 8px 0
    }
    .calendar-context-menu,.calendar-context-menu .submenu {
      border: 1px solid #ddd;
      background-color: #fff;
      box-shadow: 2px 2px 5px rgba(0,0,0,.2);
      -webkit-box-shadow: 2px 2px 5px rgba(0,0,0,.2);
      position: absolute;
      display: none
    }

    .calendar-context-menu .item {
      padding: 5px 10px;
      cursor: pointer;
      display: table;
      width: 100%
    }

    .calendar-context-menu .item:hover {
      background: #eee
    }

    .calendar-context-menu .item .content {
      display: table-cell
    }

    .calendar-context-menu .item span {
      display: table-cell;
      padding-left: 10px;
      text-align: right
    }

    .calendar-context-menu .item span:last-child {
      display: none
    }

    .calendar-context-menu .submenu {
      left: 100%;
      margin-top: -6px
    }

    .calendar-context-menu .item:hover>.submenu {
      display: block
    }`],
    standalone: true,
    imports: [CommonModule, CalendarYearMonthDayComponent]
})
export class CalendarYearComponent implements OnInit {
    @ViewChild('headerTemplate', { static: true }) public headerTemplate: TemplateRef<any>;
    startDate: string;
    endDate: string;
    entities: {};
    constructor() {}
    yearArray: Array<any>;
    selectedYear: number;
    selectedYearMonths: Array<any>;

    start: { year: number, month: number, date: number };
    end: { year: number, month: number, date: number };
    ngOnInit() {}
    applySchedular(startDate: string, endDate: string, entities: Array<string>, todayDate = new Date())
    {
        this.startDate = startDate;
        var _toDate = new Date();///"1-01-01" == endDate ||
        if(Number.isNaN(Date.parse(endDate)) || new Date(endDate).getTime() <= _toDate.getTime()) {
            endDate = DateHelper.toDateControlFormat(_toDate.setMonth(_toDate.getMonth()+12));
        }
        this.endDate = endDate;
        const data = {};
        for(let item of entities){
            if(!data[item]){ data[item] = []; }
            data[item].push(item);
        }
        this.entities = data;
        const sDate: Date = new Date(startDate);
        const eDate: Date = new Date(endDate);

        //sDate.setMonth(0);
        //eDate.setFullYear(sDate.getFullYear() + 2);

        this.selectedRangeForStart(sDate);
        this.selectedRangeForEnd(eDate);

        let nextYear = sDate;
        this.yearArray = [];
        while(nextYear.getFullYear()<=eDate.getFullYear())
        {
            this.yearArray.push(nextYear.getFullYear());
            nextYear.setFullYear(nextYear.getFullYear()+1);
        }
        this.selectedYearChange(this.yearArray[0]);
    }

    selectedRangeForStart(givendate){
        this.start = { year: givendate.getFullYear(), month: givendate.getMonth(), date: givendate.getDate() };
    }
    selectedRangeForEnd(givendate){
        this.end = { year: givendate.getFullYear(), month: givendate.getMonth(), date: givendate.getDate() };
    }

  onChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedYearChange(value); // or handle it directly
  }

    selectedYearChange(year: any){
        this.selectedYear = year;
        const current= {year: year, month: 0, date: 1 };

        if(year == this.start.year)
        {
            current.month = this.start.month;
        }

        this.selectedYearMonths = [];
        let monthCheck = current.month;
        while (monthCheck < 12)
        {
            this.selectedYearMonths.push(new Date(year, monthCheck, current.date));
            monthCheck++;
        }
    }
}

