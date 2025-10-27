export class CalcHelper {
    private static taxExclusiveFormula(amount, rate, discountAmount) {
        //Discount Amount (5%)	5	(Discount %) x (Unit Price x Qty)
        //Amount Before Tax	95	Qty x (Unit Price – Discount Amount)
        //Tax Amount (10%)	9.5	Qty x ((Unit Price -Discount Amount) x (Tax %))
        //Total Amount	104.5	Tax amount + Amount before tax

        //const discountAmount: any = amount*(discount/100);
        const amountBeforeTax: any = amount - discountAmount;
        const taxAmount: any = amountBeforeTax * (rate / 100);
        const totalAmount = taxAmount + amountBeforeTax;
        return {
            amountBeforeTax: Math.abs(amountBeforeTax),
            taxAmount: Math.abs(taxAmount),
            totalAmount: Math.abs(totalAmount)
        };
    }

    private static taxInclusiveFormula(amount, rate, discountAmount) {
        //Discount Amount (5%)	5	(Discount %) x (Unit Price) x Qty
        //Amount Before Tax	86.36	Qty x ((Unit Price – Discount Amount) / (1+ Tax %))
        //Tax Amount (10%)	8.64	Qty x [(Unit Price – Discount Amount) – (Unit Price – Discount Amount / (1+ Tax %))]
        //Total Amount	95	Tax amount + Amount before tax
        //const discountAmount = amount*(discount/100);
        const amountBeforeTax = (amount - discountAmount) / (1 + (rate / 100));
        const taxAmount = (amount - discountAmount) - amountBeforeTax;
        const totalAmount = taxAmount + amountBeforeTax;

        return {
            amountBeforeTax: Math.abs(amountBeforeTax),
            taxAmount: Math.abs(taxAmount),
            totalAmount: Math.abs(totalAmount)
        };
    }

    public static getAmountAndTaxAmount(isTaxInclusive, unitPrice, taxRate, qty, discount) {
        const _unitPrice: number = parseFloat(unitPrice);
        const _price: number = _unitPrice * (qty || 1);

        const discountAmount = _price * (discount / 100);

        const {
            amountBeforeTax, taxAmount, totalAmount
        } = (isTaxInclusive) ?
            this.taxInclusiveFormula(_price, taxRate, discountAmount) :
            this.taxExclusiveFormula(_price, taxRate, discountAmount);

        return {
            rateList: [],
            amount: _price,
            discount: discountAmount,
            amountBeforeTax,
            taxAmount: taxAmount,
            totalAmount: totalAmount
        };
    }
}