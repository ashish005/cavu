import { Component } from "@angular/core";

@Component({
  selector: 'query-filter',
  templateUrl: './query-filter.html', standalone: true
})
export class QueryFilterComponent{
  constructor(){}

  defaultOperatorMap = {
    string: ['=', '!=', 'contains', 'like'],
    number: ['=', '!=', '>', '>=', '<', '<='],
    time: ['=', '!=', '>', '>=', '<', '<='],
    date: ['=', '!=', '>', '>=', '<', '<='],
    category: ['=', '!=', 'in', 'not in'],
    boolean: ['=']
  };
}
