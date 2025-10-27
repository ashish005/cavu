import {Component, EventEmitter, HostListener, Input, Output} from "@angular/core";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'org-grid-pagination',
  templateUrl: './pagination.html', standalone: true, imports: [CommonModule]
})
export class PaginationComponent {
  @Input() hasTopBorder: boolean = true;
  @Input() padding: string = 'p-2';
  @Input() loading: boolean;

  @Input() page: number;
  @Input() count: number;
  @Input() perPage: number;

  @Output() cb: EventEmitter<any> = new EventEmitter<any>();

  pageSizes: Array<any> = [10, 25, 50, 100];

  constructor() { }

  get pagesToShow(){
    return 5;
  };

  onPageNoSelect(numberPerPage: number){
    this.perPage = numberPerPage;
    this.goToPage(1);
  }

  getMin(): number {
    return (this.perPage * (this.page-1)) + 1;
  }

  getMax(): number {
    let max = this.perPage * this.page;
    if (max > this.count) {
      max = this.count;
    }
    return max;
  }

  goToPage(pageNo: number): void {
    if( pageNo <= this.totalPages() && pageNo>0) {
      this.page = pageNo;
      this.cb.emit({skip: this.perPage * (this.page - 1), take: this.perPage});
    }
  }

  goToLastPage(){
    const c = Math.ceil(this.count / this.perPage);
    this.goToPage(c);
  }

  totalPages(): number {
    return Math.ceil(this.count / this.perPage) || 0;
  }

  get lastPage(): boolean {
    return this.perPage * this.page > this.count;
  }

  getPages(): number[] {
    const c = Math.ceil(this.count / this.perPage);
    const p = this.page || 1;
    const pagesToShow = this.pagesToShow || 9;
    const pages: number[] = [];
    pages.push(p);
    const times = pagesToShow - 1;
    for (let i = 0; i < times; i++) {
      if (pages.length < pagesToShow) {
        if (Math.min.apply(null, pages) > 1) {
          pages.push(Math.min.apply(null, pages) - 1);
        }
      }
      if (pages.length < pagesToShow) {
        if (Math.max.apply(null, pages) < c) {
          pages.push(Math.max.apply(null, pages) + 1);
        }
      }
    }
    pages.sort((a, b) => a - b);
    return pages;
  }
}
