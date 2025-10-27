import {CoreQueryOptions} from "../services/models/core-resource";

export class ListLoaderComponent {
  title: string;
  isLoading: boolean = false;
  data: Array<any>;
  count: number = 0;
  public queryOption: CoreQueryOptions;

  constructor(public service: any, private option: CoreQueryOptions) {
    this.queryOption = option
  }

  callService(queryOption: CoreQueryOptions) {
    this.isLoading = true;
    this.count = 0;

    const success = (result)=> {
      this.isLoading = false;
      this.data = result.entities;
    };
    const failure = (result)=> {
      this.isLoading = false;
    };
    this.service.list(queryOption).subscribe(success, failure);
  }
}
