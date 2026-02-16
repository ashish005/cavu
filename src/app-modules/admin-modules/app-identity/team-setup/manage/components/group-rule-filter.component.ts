import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from "@angular/core";
import {FormBuilder, FormGroup} from "@angular/forms";
import {CoreResponse} from "@app-global";
import {ColumnFilterLookup} from "../domains/lookup.serializer";
import {TeamSetupAPIResolver} from "../services/api.resolver";
import {TeamSetupService, TeamUserRecordsService} from "../services/team.service";

@Component({
  standalone: false,
  selector: '[group-rule-filter]',
  templateUrl: './templates/group-rule-filter.html'
})
export class GroupRuleFilterCeComponent implements OnInit {
    @ViewChild('optionsddl') optionsddl: ElementRef;
    @Input() customForm: FormGroup;
    @Input() index: number;

    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
    @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();

    filters: Array<ColumnFilterLookup>;
    operatorList: Array<any> = [
        {id: '=', name: 'Equal' },
        {id: '!=', name: 'Not Equal' },
        {id: '=', name: 'Like'},
        {id: 'range', name: 'Range'},
    ];
    entities: Array<any>;
    constructor(public fb: FormBuilder, public apiResolver: TeamSetupAPIResolver, public service: TeamUserRecordsService) { }

    get formUserTypeId(){ return this.customForm.get('userTypeId'); }
    get formUserFilterTypeId(){ return this.customForm.get('userFilterTypeId'); }
    get formFilterOperator(){ return this.customForm.get('operator');  }
    get formFilterValue(){ return this.customForm.get('valueId'); }
    get formFilterValueName(){ return this.customForm.get('value'); }

    updateUserTypeId(e){ this.formUserTypeId.setValue(e); }
    updateUserFilterTypeId(e){ this.formUserFilterTypeId.setValue(e); }
    updateFilterOperator(e){ this.formFilterOperator.setValue(e); }

    ngOnInit()
    {
        const userTypeId = this.formUserTypeId.value;
        const filterKeyId = this.formUserFilterTypeId.value;

        this.populateColumnFilters(userTypeId);
        if(filterKeyId)
        {
            this.populateValues(filterKeyId);
        }

        this.filters = this.apiResolver.masterType?.getFiltersByUserTypeId(this.formUserTypeId.value);
        this.formUserTypeId.valueChanges.subscribe(userTypeId => {
            this.populateColumnFilters(userTypeId);
        });
        this.formUserFilterTypeId.valueChanges.subscribe(filterKeyId => {
            this.populateValues(filterKeyId);
        })
    }

    populateValues = (filterKeyId) =>
    {
        const success =(r: CoreResponse<any>) => { this.entities = r.entities; };
        this.service.getLookupByKey(filterKeyId).toPromise().then(success);
    }

    populateColumnFilters(userTypeId) {
        this.filters = this.apiResolver.masterType?.getFiltersByUserTypeId(userTypeId);
    }
    filterChange(val)
    {
        this.formUserFilterTypeId.setValue(val);
    }

    changeFilterValue(item){
        this.formFilterValue.setValue(item.id);
        this.formFilterValueName.setValue(item.name);
    }

    deleteFilterOptions(){  this.onOk.emit({ key: 'delete', index: this.index}) }
}
