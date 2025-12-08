import {Component, OnInit} from "@angular/core";
import {CdkDragDrop, moveItemInArray, transferArrayItem, CdkDragStart, CdkDropList} from '@angular/cdk/drag-drop';
import {OrgProcessTrackerService} from "../services/org-process.service";
import {OrgWorkflowAPIResolver} from "@app-global";
interface ProcessPhase {
  id: number;
  name: string;
  color: string;
}

interface OrgProcess {
  id: number;
  name: string;
  description?: string;
  phases: ProcessPhase[];
}

interface ProcessPhaseStatus
{
  id: number;
  name: string;
}
/*@Component({
  standalone: false,
  templateUrl: './templates/process-board.html'
})
export class ProcessBoardView implements OnInit {
  connectedLists: string[] = [];
  queryOption: ProcessTrackerQueryOptions = new ProcessTrackerQueryOptions();

  // Group of tasks keyed by statusId
  tasksByStatus: { [statusId: number]: any[] } = {};
  columnList: { id: string, statusId: number, name: string }[] = [];
  constructor(public apiResolver: OrgWorkflowAPIResolver, public service: OrgProcessTrackerService,
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
        if (!this.tasksByStatus[task.processStatus]) {
          // Unknown status → initialize array
          this.tasksByStatus[task.processStatus] = [];
        }
        this.tasksByStatus[task.processStatus].push(task);
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
    const oldStatusId = movedTask.processStatus;
    movedTask.processStatus = newStatusId;
    // Call backend
    this.service.updateStatus(movedTask.id, newStatusId).subscribe({
      next: () => {
        console.log(`Task ${movedTask.id} updated → status ${newStatusId}`);
      },
      error: err => {
        console.error('Failed to update status', err);
        // Rollback UI
        transferArrayItem(currentList, previousList, event.currentIndex, event.previousIndex);
        movedTask.processStatus = oldStatusId;
      }
    });
  }

  trackByColId(index: number, col: { id: string }) {
    return col.id;
  }
}*/
@Component({
  standalone: false,
  templateUrl: './templates/process-board.html',
  styleUrls: ['./templates/transition-board.scss']
})
export class ProcessBoardView implements OnInit {
  // phases: ProcessPhase[] = [];
  // phaseStatuses: ProcessPhaseStatus[] = [];
  // processesByPhaseStatus: { [phaseId: number]: { [statusId: number]: OrgProcess[] } } = {};
  // connectedLists: string[] = [];

  constructor(private resolver: OrgWorkflowAPIResolver, private service: OrgProcessTrackerService) {}

  process = { id: 1, name: 'Order Fulfillment' };

  phases = [
    { id: 1, name: 'Initiation', color: '#6c5ce7' },
    { id: 2, name: 'Processing', color: '#00b894' },
    { id: 3, name: 'Review', color: '#fd79a8' },
    { id: 4, name: 'Completion', color: '#e17055' }
  ];

  phaseStatuses = [
    { id: 1, name: 'Pending' },
    { id: 2, name: 'In Progress' },
    { id: 3, name: 'Completed' }
  ];

  tasksByPhaseStatus: { [phaseId: number]: { [statusId: number]: any[] } } = {};
  connectedLists: string[] = [];

  ngOnInit(): void {
    this.phaseStatuses = this.resolver.masterType.phaseStatus;
    this.connectedLists = [];
    this.phases.forEach(p => {
      this.tasksByPhaseStatus[p.id] = {};
      this.phaseStatuses.forEach(s => {
        this.tasksByPhaseStatus[p.id][s.id] = [];
        this.connectedLists.push(this.getDropListId(p.id, s.id));
      });
    });

    // Sample tasks
    this.tasksByPhaseStatus[1][1] = [{ id: 101, name: 'Task 1', description: 'Collect requirements' }];
    this.tasksByPhaseStatus[2][2] = [{ id: 102, name: 'Task 2', description: 'Process order' }];
    this.tasksByPhaseStatus[4][3] = [{ id: 103, name: 'Task 3', description: 'Finalize documents' }];
  }

  getDropListId(phaseId: number, statusId: number) {
    return `${phaseId}-${statusId}`;
  }

  dropTask(event: CdkDragDrop<any[]>, phaseId: number, statusId: number) {
    const targetList = this.tasksByPhaseStatus[phaseId][statusId];
    const prevList = event.previousContainer.data;

    if (event.previousContainer === event.container) {
      moveItemInArray(targetList, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(prevList, targetList, event.previousIndex, event.currentIndex);
    }
  }
}


