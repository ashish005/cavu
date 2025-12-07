import {Component, ElementRef, Input, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {CalendarYearMonthDayComponent} from "./calendar-year-month-day.component";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
@Component({
    selector: 'calendar-year',
    templateUrl: `./templates/calendar-year.html`,
    styleUrls: [ './templates/calendar-year.css'],
    standalone: true,
    imports: [CommonModule, FormsModule, CalendarYearMonthDayComponent]
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

    start: Date;
    end: Date;
    ngOnInit() {}
    applySchedular(resp)
    {
        const { data, entities } = resp;
        const { startDate, endDate, todayDate } = data;
        this.startDate = startDate;
        /*var _toDate = new Date();///"1-01-01" == endDate ||
        if(Number.isNaN(Date.parse(endDate)) || new Date(endDate).getTime() <= _toDate.getTime()) {
            endDate = DateHelper.toDateControlFormat(_toDate.setMonth(_toDate.getMonth()+12));
        }*/
        this.endDate = endDate;
        const info = {};
        for(let item of entities){
            if(!info[item.key]){ info[item.key] = []; }
            info[item.key].push(item);
        }
        this.entities = info;
        this.start = new Date(startDate);
        this.end = new Date(endDate);

        this.yearArray = [];
        for (let y = this.start.getFullYear(); y <= this.end.getFullYear(); y++) {
            this.yearArray.push(y);
        }
        this.selectedYearChange(this.yearArray[0]);
    }
    /*selectedRangeForStart(givendate){
        this.start = { year: givendate.getFullYear(), month: givendate.getMonth(), date: givendate.getDate() };

    }
    selectedRangeForEnd(givendate){
        this.end = { year: givendate.getFullYear(), month: givendate.getMonth(), date: givendate.getDate() };
    }*/
  onChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedYearChange(value); // or handle it directly
  }

    selectedYearChange(year: any){
        this.selectedYear = year;

        const start = new Date(this.start);
        const end   = new Date(this.end);
        this.selectedYearMonths = [];
        // Loop through months 0–11 for the selected year
        for (let m = 0; m < 12; m++) {
            const d = new Date(year, m, 1);
            // Must not be before the start date
            if (d < start) continue;
            // Must not be after the end date
            if (d > end) continue;
            this.selectedYearMonths.push(d);
        }
    }
}

