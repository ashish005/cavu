import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortBy',
  standalone: true,
  pure: true,
})
export class SortByPipe implements PipeTransform {
  // Update the signature to accept a string for the property name.
  // The 'propertyName' is a string, not a complex object.
  transform(value: any[], sortDirection: string, propertyName: string): any[] {
    if (!Array.isArray(value) || !sortDirection || !propertyName) {
      return value;
    }

    return value.sort((a, b) => {
      const aVal = a[propertyName];
      const bVal = b[propertyName];

      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  }
}
