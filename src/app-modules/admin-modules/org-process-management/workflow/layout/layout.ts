import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';

@Component({
    standalone: false,
    templateUrl: './layout.html',
    styles: [`::ng-deep ng-component{ display: contents;}`],
})
export class Layout implements OnInit {
    public actionTemplate: TemplateRef<any>;
    constructor(){}
    ngOnInit(){}
    onActivate(componentRef){ this.actionTemplate = componentRef.actionTemplate; }
}