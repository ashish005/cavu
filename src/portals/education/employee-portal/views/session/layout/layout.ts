import {Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {OrgSessionService} from "../services/org-session.service";
import {OrgSession, OrgSessionQueryOptions} from "../domains/session.serializer";
import {SessionAPIResolver} from "../services/api.resolver";
import {ViewExtender} from "@app-global";
import {Batch} from "../domains/batch.serializer";

@Component({
    standalone: false,
  templateUrl: './layout.html',
  styles: [':host ::ng-deep { display: contents; }']
})
export class Layout extends ViewExtender<OrgSession> implements OnInit, OnDestroy {
    activeSessionId: number;
    override coreState: OrgSessionQueryOptions = new OrgSessionQueryOptions();
    constructor(public override service: OrgSessionService,
                public lookupResolver: SessionAPIResolver,
                public router: Router, public override activatedRoute: ActivatedRoute){
        super(activatedRoute, service);
    }

    onActivate(componentRef){
        this.actionTemplate = componentRef.actionTemplate;
        this.activeSessionId = componentRef.activatedRoute.snapshot.params.sessionId;
    }

    override ngOnDestroy(){
        super.ngOnDestroy();
    }

    ngOnInit()
    {
        super.populateGrid();
    }

    addBatch(row: OrgSession){
        const inputData: any = {
            id: null,
            data: new Batch({
                startDate: row.startDate,
                orgSessionId: row.id,
                name: (row.name || '').trim()
            })
        };
        this.lookupResolver.addUpdateBatchPopup(inputData, { text: `New Batch`, desc: '' }, this.refreshGrid);
    }

    addSession(){
        const inputData: any = {
            id: null,
            data: new OrgSession()
        };
        this.lookupResolver.addUpdateSessionPopup(inputData, { text: `New Session`, desc: '' }, this.refreshGrid);
    }

    updateSession(row)
    {
        const inputData: any = {
            id: row.id,
            data: row
        };
        this.lookupResolver.addUpdateSessionPopup(inputData, { text: `Edit: ${row.name}`, desc: '' }, this.refreshGrid);
    }

    onSessionSelect(session){
        this.activeSessionId = session.id;
        this.router
            .navigate([session.id], { relativeTo: this.activatedRoute });
    }
}