export class DateHelper {
    public static printDateOnly(date: Date) {
        date = new Date(date);

        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        const dayOfWeek = date.getDay();
        const dayOfMonth = date.getDate();
        let sup = '';
        const month = date.getMonth();
        const year = date.getFullYear();

        if (dayOfMonth === 1 || dayOfMonth === 21 || dayOfMonth === 31) {
            sup = 'st';
        } else if (dayOfMonth === 2 || dayOfMonth === 22) {
            sup = 'nd';
        } else if (dayOfMonth === 3 || dayOfMonth === 23) {
            sup = 'rd';
        } else {
            sup = 'th';
        }

        const dateString = dayNames[dayOfWeek] + ', ' + dayOfMonth + sup + ' ' + monthNames[month] + ' ' + year;

        return dateString;
    }

    public static printTimeOnly(date: Date) {
        date = new Date(date);

        let period = '';
        let minute = date.getMinutes().toString();
        let hour = date.getHours();

        period = hour < 12 ? 'AM' : 'PM';

        if (hour === 0) {
            hour = 12;
        }
        if (hour > 12) {
            hour = hour - 12;
        }

        if (minute.length === 1) {
            minute = '0' + minute;
        }

        const timeString = hour + ':' + minute + ' ' + period;

        return timeString;
    }

    public static printDate(date: Date, separator = 'at') {
        return `${this.printDateOnly(date)} ${separator} ${this.printTimeOnly(date)}`;
    }

    public static printFriendlyDate(date: Date, separator = '-') {
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
        const test = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        if (test.toDateString() === today.toDateString()) {
            return `Today ${separator} ${this.printTimeOnly(date)}`;
        }
        if (test.toDateString() === yesterday.toDateString()) {
            return `Yesterday ${separator} ${this.printTimeOnly(date)}`;
        } else {
            return this.printDate(date, separator);
        }
    }

    public static printShortDate(date: Date, separator = '/', dateTimeSeparator = '-') {
        let day = date.getDate().toString();
        let month = (date.getMonth() + 1).toString();
        const year = date.getFullYear();

        if (day.length === 1) {
            day = '0' + day;
        }

        if (month.length === 1) {
            month = '0' + month;
        }

        return `${month}${separator}${day}${separator}${year} ${dateTimeSeparator} ${this.printTimeOnly(date)}`;
    }

    public static parseDate(input: string | number | Date) {
        if (input instanceof Date) {
            return input;
        }

        if (typeof input === 'string') {
            if (input.search(/[a-su-z+]/i) === -1) {
                input = input + 'Z';
            }

            return new Date(input);
        }

        return new Date(input);
    }

    public static printDuration(start: Date, end: Date) {
        start = new Date(start);
        end = new Date(end);

        // get total seconds between the times
        let delta = Math.abs(start.valueOf() - end.valueOf()) / 1000;

        // calculate (and subtract) whole days
        const days = Math.floor(delta / 86400);
        delta -= days * 86400;

        // calculate (and subtract) whole hours
        const hours = Math.floor(delta / 3600) % 24;
        delta -= hours * 3600;

        // calculate (and subtract) whole minutes
        const minutes = Math.floor(delta / 60) % 60;
        delta -= minutes * 60;

        // what's left is seconds
        const seconds = delta % 60;  // in theory the modulus is not required

        let printedDays = '';

        if (days) {
            printedDays = `${days} days`;
        }

        if (hours) {
            printedDays += printedDays ? `, ${hours} hours` : `${hours} hours`;
        }

        if (minutes) {
            printedDays += printedDays ? `, ${minutes} minutes` : `${minutes} minutes`;
        }

        if (seconds) {
            printedDays += printedDays ? ` and ${seconds} seconds` : `${seconds} seconds`;
        }


        if (!printedDays) {
            printedDays = '0';
        }

        return printedDays;
    }

    public static getAge(birthDate: string | number | Date, otherDate: string | number | Date) {
        birthDate = new Date(birthDate);
        otherDate = new Date(otherDate);

        let years = (otherDate.getFullYear() - birthDate.getFullYear());

        if (otherDate.getMonth() < birthDate.getMonth() ||
            otherDate.getMonth() === birthDate.getMonth() && otherDate.getDate() < birthDate.getDate()) {
            years--;
        }

        return years;
    }

    public static toDateControlFormat(val: any) {
        let _date = val;
        if(!val){
            _date = new Date();
        } else {
            _date = new Date(val);
        }

        const day = _date.getDate();
        const month = _date.getMonth() + 1;
        const year = _date.getFullYear();
        return year+"-"+month.toString().padStart(2, 0) + "-" + day.toString().padStart(2, 0);
    }

    public static getMonthName(monthNumber) {
        const date = new Date();
        date.setMonth(monthNumber - 1);
        return date.toLocaleString('en-US', { month: 'short' });
    }

    public static monthsBetween(startDate: Date, end: Date)
    {
        let endDate = end || new Date();
        if(!end) {
            const _date = new Date();
            const _month = _date.getMonth();
            endDate = new Date(_date.getFullYear(), 12 - _month + 1, 1);
        }
        /*let iterator;
        let limit;

        let arr = [];

        if (endDate > startDate)
        {
            iterator = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
            limit = endDate;
        }
        else
        {
            iterator = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
            limit = startDate;
        }

        while (iterator <= limit)
        {
            arr.push({ month: iterator.Month, name: this.getMonthName(iterator.Month), year: iterator.Year });
            iterator = iterator.setMonth(iterator.getMonth() + 1);
        }*/

        var resultList = [];
        var date = new Date(startDate);
        // var endDate = new Date(endDate);
        var monthNameList = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];

        while (date <= endDate)
        {
            // var stringDate = monthNameList[date.getMonth()] + " " + date.getFullYear();
            // get first and last day of month
            // var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
            // var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            resultList.push({ month: date.getMonth(), name: this.getMonthName(date.getMonth()), year: date.getFullYear() });
            // resultList.push({ str:stringDate, first:firstDay, last:lastDay });
            date.setMonth(date.getMonth() + 1);
        }

        return resultList;
    }
}
