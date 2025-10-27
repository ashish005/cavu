import {Injectable, Injector} from "@angular/core";
import { tap, catchError } from "rxjs";
import {CoreEndpointBase} from "@app-global";

@Injectable()
export class ConnectorService extends CoreEndpointBase {
    constructor(public override injector: Injector) { super(injector); }

    getTest(){
        return this.httpClient.get(this.baseSectorAPIUrl + `integration/test`, this.requestHeaders)
            .pipe(
                tap(
                    (resp: any) => console.log('read logged')
                ),
                catchError(error => this.handleError(error, () => this.getTest()))
            );
    }

    getFile(){
        return this.httpClient.get(`${this.baseSectorAPIUrl}integration/pdf`, this.getFileDownloadRequestHeaders)
            .pipe(catchError(error => { return this.handleError(error, () => this.getFile()); }));
    }
}
