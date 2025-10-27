import {Component, OnInit} from "@angular/core";
import {DynamicComponent} from "@app-global";

@Component({
    template: `<div>
        <span>{{context.fromMeterReading}} - {{context.tillMeterReading}}</span>
        <div class="item-except">
            <small></small>
        </div>
    </div>`,
  standalone: false
})
export class TrackerMeterReadingActionCell extends DynamicComponent{
    constructor(){ super(); }
}

@Component({
    template: `<div>{{context.vehicleNo}} {{context.vehicleManufactureName}} <small class="text-success">{{ context.vehicleModel}}</small></div>`,
  standalone: false
})
export class TrackerVehicleModelActionCell extends DynamicComponent{
    constructor(){ super(); }
}

@Component({
    template: `<div>
        <span> {{context.fromDate | dateFormat}} - {{context.tillDate | dateFormat}}</span>
    </div>`,
  standalone: false
})
export class TrackerRangeActionCell extends DynamicComponent{
    constructor(){ super(); }
}

@Component({
    template: `<div><span>{{context.driverName}}</span></div>`,
  standalone: false
})
export class TrackerDriverActionCell extends DynamicComponent{
    constructor(){ super(); }
}
