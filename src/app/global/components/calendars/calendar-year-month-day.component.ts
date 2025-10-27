import {Component, Input, OnInit} from "@angular/core";
import {CommonModule, DatePipe} from "@angular/common";

interface CalendarOptions {
    dayNames: Array<string>,
    dayBegin: number,
    monthNames: Array<string>,
    onPrevMonth: any,
    onNextMonth: any,
    events: Array<any>,
    onclickDate: any,
    nextIcon: string,//"&gt;",
    prevIcon: string//"&lt;"
}

@Component({
    selector: 'calendar-year-month-day',
    templateUrl: `./templates/calendar-year-month-day.html`,
    standalone: true, imports: [ CommonModule ],
    styles: [`
    table.month tr td.disabled, table.month tr td.disabled:hover {
      color: #ddd;
      
    }

    table.month th.month-title {
      font-size: 0.6rem;/*font-size: 14px;*/
      padding-bottom: 5px
    }

    table.month th.day-header {
      font-size: 0.6rem;/*font-size: 10px*/
    }

    table.month tr td,table.month tr th {
      padding: 0
    }

    table.month td.week-number {
      cursor: default;
      font-weight: 500;
      border-right: 1px solid #eee;
      padding: 5px
    }

    table.month tr td .day-content {
      /*-webkit-border-radius: 4px;
      -moz-border-radius: 4px;
      border-radius: 4px;*/
      padding: 5px 6px
    }

    .table-striped .calendar table.month tr td,.table-striped .calendar table.month tr th {
      background-color: transparent
    }

    table.month td.day .day-content:hover {
      background: rgba(0,0,0,.2);
      cursor: pointer
    }

    table.month td.day.disabled .day-content:hover,
    table.month tr td.new,
    table.month tr td.new:hover,
    table.month tr td.old,
    table.month tr td.old:hover {
      background: 0 0;
      cursor: default
    }

    table.month tr td.range .day-content {
      background: rgba(0,0,0,.2);
      -webkit-border-radius: 0;
      -moz-border-radius: 0;
      border-radius: 0
    }

    table.month tr td.range.range-start .day-content {
      /*border-top-left-radius: 4px;
      border-bottom-left-radius: 4px*/
    }

    table.month tr td.range.range-end .day-content {
      /*border-top-right-radius: 4px;
      border-bottom-right-radius: 4px*/
    }`]
})
export class CalendarYearMonthDayComponent implements OnInit {
    //@ViewChild('todayDate', {static: true, read: ElementRef}) el: ElementRef;
    options = <CalendarOptions>{
        dayNames: ["S", "M", "T", "W", "T", "F", "S"],
        dayBegin: 0,
        monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        onPrevMonth: function (e) {},
        onNextMonth: function (e) {},
        events: [{
            date: null,
            eventName: null,
            className: null,
            onclick: function (e, t) {},
            dateColor: "#38385c"
        }],
        onclickDate: function (e, t) {},
        nextIcon: "&gt;",
        prevIcon: "&lt;"
    };
    eventAnimate = "none";
    @Input() pickedDate: Date;
    @Input() events: any;

    calendarArray: Array<any>;
    month: number;
    match: string = "yyyy-MM-dd";
    today: string;
    constructor(public datepipe: DatePipe) {}

    ngOnInit() {
        this.today = this.datepipe.transform(new Date(), this.match);
        if(this.pickedDate){

        }
        this.month = this.pickedDate.getMonth();
        const option: CalendarOptions = <CalendarOptions>{
            dayBegin: 0,
            prevIcon: '&#x3c;',
            nextIcon: '&#x3e;',
            onPrevMonth: function (e) {
                console.log("prev");
            },
            onNextMonth: function (e) {
                console.log("next");
            },
            events: [
                {
                    date: new Date("2022-02-07"),
                    eventName: "Holiday",
                    className: "badge bg-danger",
                    onclick(e, data) {
                        console.log(data);
                    },
                    dateColor: "red"
                },
                {
                    date: new Date("2022-02-07"),
                    eventName: "Holiday with wife",
                    className: "badge bg-danger",
                    onclick(e, data) {
                        console.log(data);
                    },
                    dateColor: "red"
                },
                {
                    date: new Date("2022-02-08"),
                    eventName: "Working day",
                    className: "badge bg-success",
                    onclick(e, data) {
                        console.log(data);
                    },
                    dateColor: "green"
                }
            ],
            onclickDate: function (e, data) {
                console.log(e, data);
            }
        };
        this.buildcalendar();
    }

    dateclicked = (iYear, iMonth, iDay) => {
        var dSelected = new Date(iYear, iMonth, iDay);
        console.log('A date has been clicked! - ' + dSelected + ' - ' + iYear + ' - ' + iMonth + ' - ' + iDay);
    };
    buildcalendar = () => {
        console.log('Building our Calendar with Javascript');
        this.calendarArray = this.getCalendarArray();
        /*const p = this.getCalendarArray();
        var gridItems = `<table class="month">`;
        gridItems += '<thead><tr><th class="month-title" colspan="7">'+this.options.monthNames[this.pickedDate.getMonth()]+'</th></tr>';
        gridItems += '<tr>';
        const dayNamesLen = this.options.dayNames.length;
        for (let e = 0; e < dayNamesLen; e++) {
            let startDay = e + this.options.dayBegin;
            if (startDay >= dayNamesLen) {
                startDay -= dayNamesLen;
            }
            gridItems += '<th class="day-header">' + this.options.dayNames[startDay] + '</th>';
        }
        gridItems += '</tr></thead><tbody>';
        p.forEach((function (e) {
                gridItems += '<tr>';
                e.forEach((function (e) {
                        gridItems += '<td class="day"><div class="day-content">' + e.date + '</div> </td>';
                        // this.options.events.forEach((function (t) {
                        //         if (t.date.getFullYear() == e.datejs.getFullYear() && t.date.getMonth() == e.datejs.getMonth() && t.date.getDate() == e.datejs.getDate()) {
                        //             n.addClass("event");
                        //             var a = $(`<div class="gc-event ${t.className}">${t.eventName}</div>`);
                        //             s = "color:" + (t.dateColor || "inherit");
                        //             a.on("click", (function (e) { t.onclick(e, t) } ));
                        //             n.append(a);
                        //         }
                        //     }
                        // ));
                        //o.attr("style", s);
                    }
                ));
                gridItems += '</tr>';
            }
        ));
        gridItems += '</tbody></table>';
        this.el.nativeElement.append = gridItems;*/
    }

    prevMonth() {
        this.pickedDate = new Date(this.pickedDate.getFullYear(), this.pickedDate.getMonth() - 2, 1);
        this.options.onPrevMonth(this.pickedDate);
        this.eventAnimate = "prev";
        this.buildcalendar();
    }

    nextMonth() {
        this.pickedDate = new Date(this.pickedDate.getFullYear(), this.pickedDate.getMonth(), 1);
        this.options.onNextMonth(this.pickedDate);
        this.eventAnimate = "next";
        this.buildcalendar();
    }

    getCalendarArray() {
        var e = new Date(this.pickedDate.getFullYear(), this.pickedDate.getMonth(), 1).getDay()
            , t = new Date(this.pickedDate.getFullYear(), this.pickedDate.getMonth() + 1, 0).getDate()
            , n = new Date(this.pickedDate.getFullYear(), this.pickedDate.getMonth(), 0).getDate()
            , a = []
            , o = e - this.options.dayBegin;
        if(o < 0) { o = 7 + o; }
        for (let e = 0; e < o; e++) {
            const datejs = new Date(this.pickedDate.getFullYear(), this.pickedDate.getMonth() - 1, n);
            a.push({ datejs: datejs, match: this.datepipe.transform(datejs, this.match), date: n, dType:'prev-month', class: "old text-muted" });
            n--;
        }

        a.reverse();
        var s = 1;
        for (let e = a.length; e < 7; e++) {
            const datejs = new Date(this.pickedDate.getFullYear(), this.pickedDate.getMonth(), s);
            a.push({ datejs: datejs, match: this.datepipe.transform(datejs, this.match), date: s, dType:'current-month', class: "" });
            s++;
        }

        var c = [a], i = !1, d = this.pickedDate, dType = "current-month", l = "";
        for (let e = 1; e < 6; e++) {
            var r = [];
            for (let e = 0; e < 7; e++) {
                const datejs = new Date(d.getFullYear(), d.getMonth(), s);
                r.push({ datejs: datejs, match: this.datepipe.transform(datejs, this.match), date: s, dType: dType, class: l });
                if (++s > t) {
                    s = 1;
                    d.setDate(1);
                    d.setMonth(d.getMonth() + 1);
                    i = !0;
                    l = "new text-muted";//"next-month"
                    dType = 'next-month';
                }
            }
            c.push(r);
            /*if (i){
                break
            }*/
        }
        return c;
    }

    getCurrenyDay(i){
        const {dayBegin, dayNames, } = this.options;
        if((i+dayBegin) < dayNames.length){
            return dayNames[i+dayBegin]
        }
        return dayNames[i+dayBegin-dayNames.length];
    }
}
