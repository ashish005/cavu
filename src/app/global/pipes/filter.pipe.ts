import {Pipe, PipeTransform} from "@angular/core";

@Pipe({ name: 'filter', pure: true, standalone: true })
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchfn: string, searchText: string): any[] {
    if(!items) return [];
    if(!searchText) return items;
    searchText = searchText.toLowerCase();

    // const queryExec = (it)=> {
    //   const s = searchKeys.map((r)=> it[r].toLowerCase());
    //   return s.join('|').includes(searchText);
    // };

    // return items.filter( it => {
    //   return it.toLowerCase().includes(searchText);
    // });
    //return items.filter( queryExec);
    return items.filter( it => {
      return it[searchfn](searchText);
    });
  }
}

@Pipe({ name: 'searchFilter', pure: true, standalone: true })
export class SearchFilterPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        if(!value)return null;
        if(!args)return value;

        args = args.toLowerCase();

        return value.filter(function(data){
            return JSON.stringify(data).toLowerCase().includes(args);
        });
    }

}

@Pipe({ name: 'filterFunction', pure: true, standalone: true })
export class FilterFunctionPipe implements PipeTransform {
    transform(items: any[], filter: any, compareObj: any): any {
        if (!items || !filter) {
            return items;
        }
        // filter items array, items which match and return true will be
        // kept, false will be filtered out
        return (items || []).filter(r => filter(r, compareObj));
    }
}

@Pipe({ name: 'filterFind', pure: true, standalone: true })
export class filterFindPipe implements PipeTransform {
    transform(items: any[], filter: any): any {
        if (!items || !filter) {
            return items;
        }
        // filter items array, items which match and return true will be
        // kept, false will be filtered out
        const result = (items || []).find(filter) || {};
        return [result];
    }
}
