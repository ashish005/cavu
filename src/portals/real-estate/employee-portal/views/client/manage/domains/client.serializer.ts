import {CoreQueryOptions, CoreResource} from "@app-global";
//import {NotificationUser} from "@app-base/models/notification/recipient.serializer";

export class ClientQueryOptions extends CoreQueryOptions {
    searchAction: string;
    projectId: string;

    constructor(model: any = {}) { super(model); }

    override toQueryString() {
        const obj = {
            searchAction: this.searchAction,
            projectId:this.projectId,
        };
        return super.getParamByObject(obj);
    }
}

export class Client extends CoreResource {
    title: string;
    fName: string;
    lName: string;
    nickName: string;

    dob: string;
    genderId: number;
    maritalStatusId: number;
    bloodGroupId: number;
    nationalityId: number;

    isRegistered: boolean;
    registrationNo: string;
    registrationDate: string;
    companyName: string;
    taxRegistrationNo: string;

    address: string;
    pincode: string;

    phone: string;
    email: string;

    // approved: number;
    // receipt: number;
    // expense: number;
    // overDue: number;
    balance: number;
    credit: number;
    debit: number;
    dueAmount: number;
    dueDate: string;
    userId: string;
    accountId: string;
    //projects: Array<Project>;
    // notificationUser: NotificationUser;
    // userAudit: UserAuditInfo;
    constructor(model: any = <any>{}) {
        const {
            id, title, fName, lName, nickName, dob, genderId, maritalStatusId, bloodGroupId, nationalityId,
            isRegistered, companyName, registrationNo, registrationDate, taxRegistrationNo,
            address, pincode,
            phone, email,
            //approved, receipt, expense, overDue,
            balance, credit, debit, dueAmount, dueDate,
            userId, accountId,
            notificationUser, userAuditInfo
        } = model;
        super();
        this.id = id;
        this.title = title;
        this.fName = fName;
        this.lName = lName;
        this.nickName = nickName;
        this.dob = dob;
        this.genderId = genderId;
        this.maritalStatusId = maritalStatusId;
        this.bloodGroupId = bloodGroupId;
        this.nationalityId = nationalityId;

        this.isRegistered = isRegistered;
        this.companyName = companyName;
        this.taxRegistrationNo = taxRegistrationNo;
        this.registrationNo = registrationNo;
        this.registrationDate = registrationDate;

        this.address = address;
        this.pincode = pincode;

        this.phone = phone;
        this.email = email;

        // this.approved = approved;
        // this.overDue = overDue;
        // this.receipt = receipt;
        // this.expense = expense;
        this.balance = balance;
        this.credit = credit;
        this.debit = debit;
        this.debit = dueAmount;
        this.debit = dueDate;

        this.userId = userId;
        this.accountId = accountId;

        //this.projects =  (projects || []).map(r => new Project(r));
        // this.notificationUser = new NotificationUser(notificationUser);
        // this.userAudit = new UserAuditInfo(userAuditInfo);
    }

    public get name(){
        return `${this.fName} ${this.lName}`;
    }
}

export class ClientSerializer {
    fromJson(json: any): Client {
        return new Client(json);
    }

    toJson(model: any): any {
        const {
            id, title, fName, lName, nickName, name, dob, genderId, maritalStatusId, bloodGroupId, nationalityId,
            isRegistered, companyName, taxRegistrationNo, registrationNo, registrationDate,
            address, pincode, phone, email
        } = model;

        return {
            fName: fName,
            lName: lName,
            nickName: nickName,
            dob: dob,
            genderId: genderId,
            maritalStatusId: maritalStatusId,
            bloodGroupId: bloodGroupId,
            nationalityId: nationalityId,
            isRegistered: isRegistered,
            companyName: companyName,
            taxRegistrationNo: taxRegistrationNo,
            registrationNo: registrationNo,
            registrationDate: registrationDate,

            address: address,
            pincode: pincode,
            phone: phone,
            email: email
        };
    }
}
