import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {TeamUserGroup} from "../domains/user-group.serializer";
import { ViewExtender } from "@app-global";
import {TeamGroupService} from "../services";
import {GroupCategory, GroupCategoryQueryOptions} from "../domains/group-category.serializer";

@Component({
    standalone: false,
    selector: 'group-list',
    templateUrl: './templates/group-list.html',
    styles: [`:host{ display: contents; }`]
})
export class GroupListComponent extends ViewExtender<GroupCategory> implements OnInit
{
    @Output() cb: EventEmitter<any> =  new EventEmitter<any>();
    @Output() editCb: EventEmitter<any> =  new EventEmitter<any>();
    override coreState: GroupCategoryQueryOptions = new GroupCategoryQueryOptions();
  constructor(public override service: TeamGroupService,
              public override activatedRoute: ActivatedRoute)
    {
        super(activatedRoute, service)
    }

    ngOnInit(){ super.populateGrid(); }
    showGroup(group: TeamUserGroup) { this.cb.emit(group); }
    editTeam(group: TeamUserGroup) { this.editCb.emit(group); }
}
