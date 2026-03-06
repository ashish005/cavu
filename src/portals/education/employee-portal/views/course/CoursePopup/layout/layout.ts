import {Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import {COURSE_VIEW} from "../enums/course-view.enum";
import {CourseService} from "../services/course.service";
import {Course} from "../domain/course.serializer";

@Component({
  standalone: false,
    templateUrl: './layout.html', styles: [`:host { display: contents;}`]
})
export class CourseLayout implements OnInit, OnDestroy {
  @ViewChild('popupOptionsTemplate', { static: true }) public popupOptionsTemplate: TemplateRef<any>;
  @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
  @ViewChild('courseFormComp', { static: true }) public courseFormComp;

  public isLoading: boolean = true;
  public actionTemplate: TemplateRef<any>;
  private subscriber: Subscription;

  @Input() id;
  @Input() data;
  tabs: any = COURSE_VIEW;
  activeTab: string = this.tabs.COURSE;
  openTab(tab: string){ this.activeTab = tab; }

  course: Course;

  constructor(public activatedRoute: ActivatedRoute, public service: CourseService) {}

  ngOnInit(){
      /*this.course = new Course({});
      if(this.id) {
          this.subscriber = this.service.read(this.id).subscribe((resp)=>{ this.course = resp.data; });
      }*/
  }

  ngOnDestroy(){ this.subscriber?.unsubscribe(); }
  refreshGrid(e){}
}