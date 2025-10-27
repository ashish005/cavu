import {Component, Input, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {ACTION_ENUM} from "@app-global";
import {FormBuilder} from "@angular/forms";
import {VehicleAPIResolver} from "../services/api.resolver";
import {VehicleForm} from "../forms/vehicle.form";
import {VehicleService} from "../services/vehicle.service";
import {Vehicle} from "../domains/vehicle.serializer";
import {pairwise, startWith} from "rxjs";
import {Model} from "../domains/lookup";

@Component({
    templateUrl: `./templates/vehicle-ce.html`, standalone: false
})
export class VehicleCeComponent extends VehicleForm implements OnInit {
    public options: any;//OrgOptions;
    vehicleModel: Model;
    models: Array<Model>;
    get actionType (){ return (this.id) ? ACTION_ENUM.UPDATE: ACTION_ENUM.ADD; };
    @Input() id: any;
    @Input() set data (item: Vehicle) { super.populate(item); }
    submitted: boolean = false;
    @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
    constructor(public override fb: FormBuilder, public apiResolver: VehicleAPIResolver, private service: VehicleService) {
        super(fb);
        const fuelTypeChanges = ([prev, next]: [any, any]) =>
        {
            if(prev != next)
            {
                this.formModelId.reset();
                this.models = this.apiResolver.masterType?.getModelsByFuelType(next);
            }
        };
        const vehicleModelChanges = ([prev, next]: [any, any]) =>
        {
            if(prev != next)
            {
                this.vehicleModel = (this.models || []).find(r => r.id == next);
                this.formMileage.setValue(<any>this.vehicleModel?.mileage);
            }
        };
        this.formFuelTypeId.valueChanges.pipe(startWith(null as string), pairwise()).subscribe(fuelTypeChanges);
        this.formModelId.valueChanges.pipe(startWith(null as string), pairwise()).subscribe(vehicleModelChanges);
    }

    //get vehicleModelName(){ return `Model No ${this.vehicleModel? this.vehicleModel.vehicleTypeName + ' '+this.vehicleModel.mileage: ''}`}

    ngOnInit(){}

    onSubmit(form) {
        // stop here if form is invalid
        if (form.invalid) { return; }

        const success = (resp)=> {
            this.submitted = false;
            this.onOk.emit({ refresh: true });
        };

        const error = (resp)=> {
            this.submitted = false;
        };

        this.submitted = true;
        if(this.actionType == ACTION_ENUM.UPDATE && this.id) {
            this.service.update(this.id, form.value).subscribe(success, error);
        } else if(this.actionType == ACTION_ENUM.ADD) {
            this.service.create(form.value).subscribe(success, error);
        }
    }
}
