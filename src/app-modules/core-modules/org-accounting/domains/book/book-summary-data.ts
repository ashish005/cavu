export class BookSummaryData {
    netCredit: number;
    netDebit: number;
    openingBalance: number;
    closingBalance: number;
    constructor(model: any = <any>{}) {
        this.netCredit = model.netCredit;
        this.netDebit = model.netDebit;
        this.openingBalance = model.openingBalance;
        this.closingBalance = model.closingBalance;
    }
}