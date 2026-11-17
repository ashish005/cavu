import {Component, OnInit, ViewChild, inject, TemplateRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterLink, RouterLinkActive, ActivatedRoute, RouterOutlet, Router} from '@angular/router';
import { FormsModule } from '@angular/forms';

/** Discovery Studio — composed of small cards: builder, sources, runs log, attributed output. */
@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: 'discovery.html'
})
export class DiscoveryStudioComponent implements OnInit {
  route = inject(ActivatedRoute);
  ngOnInit() {}
  public actionTemplate: TemplateRef<any>;
  constructor(private router: Router, public activatedRoute: ActivatedRoute){}

  onActivate(componentRef){
    this.actionTemplate = componentRef.actionTemplate;
  }
}
