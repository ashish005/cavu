import {Injectable, Injector} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve} from "@angular/router";
import {BusinessLookup} from "../domains/lookup.serializer";
import {HttpClient} from "@angular/common/http";
import {environment} from "@app-environments";
import {LoaderService} from "@app-global";

@Injectable()
export class TrialBusinessAPIResolver implements Resolve<any> {
  masterType: BusinessLookup = new BusinessLookup();
  public viewUrl = `${environment.authBaseUrl}/trialLookup`;
  constructor(protected httpClient: HttpClient, private loaderService: LoaderService) {
  }

  resolve(route: ActivatedRouteSnapshot) {
    const success = (results: any) => {
        this.masterType = results.data;
    };

    const failure = (err: any) => {};

    const setup = this.httpClient.get(`${this.viewUrl}/1.0.0`);
    return this.loaderService.resolver(setup, success, failure);
  }
}
