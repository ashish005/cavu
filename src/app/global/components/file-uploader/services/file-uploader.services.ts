import {Injectable, Injector} from "@angular/core";
import {CoreEndpointBase, CoreQueryOptions} from "../../../services";
import { Observable, take, catchError, map } from "rxjs";
import {UserDocumentGrid} from "../domains/user-document.serializer";

@Injectable()
export class FileUploaderService extends CoreEndpointBase {
    constructor(public override injector: Injector){ super(injector); }

    public get viewUrl(){ return `${this.baseSectorAPIUrl}document`; }

    public list(queryOptions: CoreQueryOptions) {
        return this.httpClient
            .get(`${this.viewUrl}?${queryOptions.toQueryString()}`, this.requestHeaders)
            .pipe( take(1), map(resp => new UserDocumentGrid(resp)) );
    }
}