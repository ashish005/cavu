import { Component, OnInit } from "@angular/core";
import { TeamUserRecordsService } from "../services/team.service";
@Component({
    standalone: false,
    selector: 'rule-record',
    templateUrl: './templates/rule-record.html',
    styles: [':host { display: contents; }']
})
export class RuleRecordComponent implements OnInit{
    userList: Array<any>;
    constructor(public service: TeamUserRecordsService) {}
    populateRecord(data){
        const success = (resp)=> { this.userList = resp.entities; };
        const error = (resp)=> {};
        this.service.getUserRecords(data).subscribe(success, error);
    }
    ngOnInit(){}
}
