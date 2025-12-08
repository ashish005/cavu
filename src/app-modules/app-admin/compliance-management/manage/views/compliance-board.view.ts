import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ComplianceAPIResolver, ComplianceTrackerService} from "../services";
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import {BoardTrackerTaskQueryOptions} from "../domains/compliance-tracker.serializer";

@Component({
  standalone: false,
  templateUrl: './templates/compliance-board.html'
})
export class ComplianceBoardView implements OnInit {
  connectedLists: string[] = [];
  queryOption: BoardTrackerTaskQueryOptions = new BoardTrackerTaskQueryOptions();

  // Group of tasks keyed by statusId
  tasksByStatus: { [statusId: number]: any[] } = {};
  columnList: { id: string, statusId: number, name: string }[] = [];
  constructor(public apiResolver: ComplianceAPIResolver, public service: ComplianceTrackerService,
              public router: Router, public activatedRoute: ActivatedRoute) {
  }

  ngOnInit(){
    // Step 1: Initialize tasksByStatus with all known statuses
    this.tasksByStatus = {};
    this.apiResolver.masterType.taskStatus.forEach(s => { this.tasksByStatus[s.id] = []; });
    // create list of column IDs for cdkDropListConnectedTo
    this.connectedLists = this.apiResolver.masterType.taskStatus.map(s => 'col-' + s.id);
    this.loadTasks();
  }

  loadTasks() {
    this.service.list(this.queryOption).subscribe(r => {
      // Step 2: Populate tasks into buckets
      r.entities.forEach(task => {
        if (!this.tasksByStatus[task.complianceStatus]) {
          // Unknown status → initialize array
          this.tasksByStatus[task.complianceStatus] = [];
        }
        this.tasksByStatus[task.complianceStatus].push(task);
      });

      // Step 3: Prepare column list for template
      this.columnList = Object.keys(this.tasksByStatus).map(k => {
        const statusId = +k;
        const status = this.apiResolver.masterType.taskStatus.find(s => s.id === statusId);
        return {
          id: 'col-' + statusId,
          statusId,
          name: status?.name || 'Unknown'
        };
      });

      // Step 4: Prepare connected lists for CDK
      this.connectedLists = this.columnList.map(c => c.id);
    });
  }

  dropTask(event: CdkDragDrop<any[]>, newStatusId: number) {
    const previousList = event.previousContainer.data;
    const currentList = event.container.data;

    if (event.previousContainer === event.container) {
      moveItemInArray(currentList, event.previousIndex, event.currentIndex);
      return;
    }
    // Move in UI
    transferArrayItem(previousList, currentList, event.previousIndex, event.currentIndex);

    const movedTask = currentList[event.currentIndex];
    const oldStatusId = movedTask.complianceStatus;
    movedTask.complianceStatus = newStatusId;
    // Call backend
    this.service.updateStatus(movedTask.id, newStatusId).subscribe({
      next: () => {
        console.log(`Task ${movedTask.id} updated → status ${newStatusId}`);
      },
      error: err => {
        console.error('Failed to update status', err);
        // Rollback UI
        transferArrayItem(currentList, previousList, event.currentIndex, event.previousIndex);
        movedTask.complianceStatus = oldStatusId;
      }
    });
  }

  trackByColId(index: number, col: { id: string }) {
    return col.id;
  }
}
