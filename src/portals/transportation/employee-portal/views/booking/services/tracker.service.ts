import {Injectable, Injector} from '@angular/core';
import  { OrgResourceService } from "@app-global"
import {Tracker, TrackerSerializer} from "../domains/tracker.serializer";
import {BookingReceipt, BookingReceiptSerializer} from "../domains/booking-receipt.serializer";

@Injectable()
export class TrackerService extends OrgResourceService<Tracker>{
    constructor(public override injector: Injector) { super(injector, 'tracker', new TrackerSerializer()); }
}

@Injectable()
export class BookingReceiptService extends OrgResourceService<BookingReceipt>{
    constructor(public override injector: Injector) { super(injector, 'bookingReceipt', new BookingReceiptSerializer()); }
}
