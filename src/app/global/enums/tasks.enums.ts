export enum FREQUENCY_TYPE {
    FIXED_TIME = "FIXED_TIME",
    DAILY = "DAILY",
    WEEKLY = "WEEKLY",
    MONTHLY = "MONTHLY",
    ON_EVENT = "ON_EVENT"
}
export enum YEAR_MODE_ENUM {
    CUSTOM = "custom",
    CALENDER_YEAR = "calendarYear",
    FINANCIAL_YEAR = "financialYear"
}
export const WEEK_DAYS: Array<any> = [
    { name: 'Monday', id:1, isChecked: true },
    { name: 'Tuesday', id:2, isChecked: false },
    { name: 'Wednesday', id:3, isChecked: false },
    { name: 'Thurs', id:4, isChecked: false },
    { name: 'Friday', id:5, isChecked: false },
    { name: 'Saturday', id:6, isChecked: false },
    { name: 'Sunday', id:0, isChecked: false }
];
export const MONTHS: Array<any> = [
    { name: 'Jan', id:1, isChecked: true},
    { name: 'Feb', id:2, isChecked: false},
    { name: 'Mar', id:3, isChecked: false},
    { name: 'Apr', id:4, isChecked: false},
    { name: 'May', id:5, isChecked: false},
    { name: 'Jun', id:6, isChecked: false},
    { name: 'Jul', id:7, isChecked: false},
    { name: 'Aug', id:8, isChecked: false},
    { name: 'Sep', id:9, isChecked: false},
    { name: 'Oct', id:10, isChecked: false},
    { name: 'Nov', id:11, isChecked: false},
    { name: 'Dec', id:12, isChecked: false}
];
export const DAYS: Array<any> = [
    { name: '1', id:1, isChecked: true },
    { name: '2', id:2, isChecked: false },
    { name: '3', id:3, isChecked: false },
    { name: '4', id:4, isChecked: false },
    { name: '5', id:5, isChecked: false },
    { name: '6', id:6, isChecked: false },
    { name: '7', id:7, isChecked: false },
    { name: '8', id:8, isChecked: false },
    { name: '9', id:9, isChecked: false },
    { name: '10', id:10, isChecked: false },
    { name: '11', id:11, isChecked: false },
    { name: '12', id:12, isChecked: false },
    { name: '13', id:13, isChecked: false },
    { name: '14', id:14, isChecked: false },
    { name: '15', id:15, isChecked: false },
    { name: '16', id:16, isChecked: false },
    { name: '17', id:17, isChecked: false },
    { name: '18', id:18, isChecked: false },
    { name: '19', id:19, isChecked: false },
    { name: '20', id:20, isChecked: false },
    { name: '21', id:21, isChecked: false },
    { name: '22', id:22, isChecked: false },
    { name: '23', id:23, isChecked: false },
    { name: '24', id:24, isChecked: false },
    { name: '25', id:25, isChecked: false },
    { name: '26', id:26, isChecked: false },
    { name: '27', id:27, isChecked: false },
    { name: '28', id:28, isChecked: false },
    { name: '29', id:29, isChecked: false },
    { name: '30', id:30, isChecked: false },
    { name: 'Last', id:-1, isChecked: false },
];
export const WEEK_OF: Array<any> = [
    { name: 'First', id:1, isChecked: true},
    { name: 'Second', id:2, isChecked: false},
    { name: 'Third', id:3, isChecked: false},
    { name: 'Fourth', id:4, isChecked: false},
    { name: 'Last', id:-1, isChecked: false}
];
export const YEAR_MODES: Array<any> = [
    { id: YEAR_MODE_ENUM.CUSTOM, name: 'Custom Year', showInShortScheduler: false, },
    { id: YEAR_MODE_ENUM.CALENDER_YEAR, name: 'Calendar Year', showInShortScheduler: true, },
    { id: YEAR_MODE_ENUM.FINANCIAL_YEAR, name: 'Financial Year', showInShortScheduler: true, }
];