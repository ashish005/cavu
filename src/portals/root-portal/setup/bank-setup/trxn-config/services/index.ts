import {PaymentCardTypeService} from "./card-type.service";
import {BankAccountTypeService} from "./bank-account-type.service";
import {BankTransactionTypeService} from "./bank-transaction-type.service";

export const TRXN_CONFIG_SERVIES = [
    BankAccountTypeService,
    PaymentCardTypeService, BankTransactionTypeService
]