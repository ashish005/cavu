import {Subscription} from "rxjs";

export class CoreLoaderComponent {
    isLoading: boolean = false;
    entities: Array<any>;
    count: number = 0;

    hasError: boolean = false;
    errorMsg: string;
    subscriber: Subscription;

    success = (result)=> {
        this.isLoading = false;
        this.entities = result.entities;
        this.hasError = false;
        this.errorMsg = null;
    };

    failure = (result)=> {
        this.isLoading = false;
        this.hasError = true;

        const { message, error } = result;
        this.errorMsg = error?.Message || message;
    };
}