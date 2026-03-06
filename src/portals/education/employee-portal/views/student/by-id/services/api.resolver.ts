import {EventEmitter, Injectable, Injector} from "@angular/core";
import {ActivatedRoute, ActivatedRouteSnapshot, Resolve, Router} from "@angular/router";
import {OrgStudentLookup, OrgStudentLookupSerializer} from "../domains/lookup.serializer";
import {BehaviorSubject} from "rxjs";
import {ASIDE_CLASS, ASIDE_SIZE, OrgResourceService, SharedService} from "@app-global"
import {CommunicationForm} from "../components/communication-form/communication-form";
import {GuardianForm} from "../components";

@Injectable()
export class StudentAPIResolver extends OrgResourceService<OrgStudentLookup> implements Resolve<any> {
  masterType: OrgStudentLookup;
  constructor(public override injector: Injector, private popupService: SharedService) {
      super(injector, 'lookup/fee-master-type', new OrgStudentLookupSerializer());
  }

  moduleCode: string;

  resolve(route: ActivatedRouteSnapshot) {
    const success = (results) => {
      this.masterType = results.data;
    };
    const failure = (err: any) => {};
    const setup = this.read(this.apiVersion);
    return this.performRouteResolver(route.data, setup, success, failure);
  }

  arrayToObject = (array, keyField) => array.reduce((obj, item) => {
    obj[item[keyField]] = item;
    return obj
  }, {});



    showAddressPopup(inputData: any) {
        // const popup = {
        //     header: {text: `${inputData.actionType} ${inputData.data.showName}`, desc: `${inputData.actionType} ${inputData.data.showName}`},
        //     aside: ASIDE_CLASS.RIGHT,
        //     size: ASIDE_SIZE.W_50
        // };
        //
        // let modal$ = this.popupService.showCustomPopup(LocationComponent, popup, inputData);
        // modal$.then((resp) => {
        //   this.popupService.destroy();
        // }, (err) => {
        //   this.popupService.destroy();
        // });
    }

    guradianPopup(inputData: any) {
        const popup = {
            header: {text: `${inputData.actionType} ${inputData.data.showName}`, desc: `${inputData.actionType} ${inputData.data.showName}`},
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_50
        };

        let modal$ = this.popupService.showCustomPopup(GuardianForm, popup, inputData);
        modal$.then((resp) => {
            this.popupService.destroy();
        }, (err) => {
            this.popupService.destroy();
        });
    }

    communicationPopup(inputData: any) {
        const popup = {
            header: {text: `${inputData.actionType} ${inputData.data.showName}`, desc: `${inputData.actionType} ${inputData.data.showName}`},
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_75
        };

        let modal$ = this.popupService.showCustomPopup(CommunicationForm, popup, inputData);
        modal$.then((resp) => {
            this.popupService.destroy();
        }, (err) => {
            this.popupService.destroy();
        });
    }
}
