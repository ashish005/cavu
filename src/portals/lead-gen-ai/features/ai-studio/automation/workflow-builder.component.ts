import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface WfNode { id: string; type: string; title: string; spec: string; x: number; y: number; retries: number; }

const TYPES = ['Trigger', 'Intelligence', 'Condition', 'AI Action', 'Integration', 'Delay', 'Notification'];

/** Visual node-graph workflow builder — positioned nodes + SVG bezier edges + inspector. */
@Component({
  selector: 'app-workflow-builder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="wb">
    <div class="wb-toolbar">
      <select [(ngModel)]="selType"><option *ngFor="let t of types" [value]="t">{{ t }}</option></select>
      <button class="btn" (click)="addNode()">+ Add step</button>
      <button class="btn" (click)="autoLayout()">Auto layout</button>
      <button class="btn primary" (click)="runTrace()" [disabled]="traceRunning || !nodes.length">Run test trace</button>
      <span class="muted" *ngIf="traceRunning">Tracing step {{ traceIndex + 1 }} / {{ nodes.length }}…</span>
      <span class="muted ok" *ngIf="traceDone">✓ Trace complete — {{ nodes.length }} step(s) passed</span>
    </div>
    <div class="canvas" #canvas>
      <svg class="edges">
        <path *ngFor="let e of edges" [attr.d]="e.d" fill="none" stroke="#94a3b8" stroke-width="2" marker-end="url(#arr)"/>
        <defs><marker id="arr" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#94a3b8"/></marker></defs>
      </svg>
      <div class="node" *ngFor="let n of nodes; let i = index" [class.sel]="sel===n" [class.active]="traceIndex===i" [class.passed]="traceDone || traceIndex>i" [style.left.px]="n.x" [style.top.px]="n.y"
           (click)="sel=n; $event.stopPropagation()" (dblclick)="removeNode(n)">
        <div class="n-type" [attr.data-t]="n.type">{{ n.type }}</div>
        <div class="n-title">{{ n.title }}</div>
        <div class="n-spec">{{ n.spec || '—' }}</div>
      </div>
      <p class="muted hint" *ngIf="!nodes.length">Click "+ Add step" to build the flow. Drag nodes by title (dbl-click removes).</p>
    </div>
    <div class="inspector" *ngIf="sel">
      <h4>Node inspector</h4>
      <div class="field"><label>Step title</label><input [(ngModel)]="sel.title" (ngModelChange)="changed()"/></div>
      <div class="field"><label>Execution spec</label><textarea [(ngModel)]="sel.spec" rows="3" (ngModelChange)="changed()"></textarea></div>
      <div class="row">
        <div class="field"><label>Max retries</label><input type="number" [(ngModel)]="sel.retries" min="0" max="10" (ngModelChange)="changed()"/></div>
        <div class="field"><label>Type</label><select [(ngModel)]="sel.type" (ngModelChange)="changed()"><option *ngFor="let t of types" [value]="t">{{ t }}</option></select></div>
      </div>
      <button class="btn danger" (click)="removeNode(sel)">Delete node</button>
    </div>
  </div>`,
  styles: [`
    .wb{display:grid;grid-template-columns:1fr 280px;gap:14px}
    .wb-toolbar{grid-column:1/-1;display:flex;gap:8px;align-items:center}
    .canvas{position:relative;background:
      radial-gradient(circle,#cbd5e1 1px,transparent 1px);background-size:20px 20px;
      background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;height:420px;overflow:auto}
    .edges{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
    .node{position:absolute;width:180px;background:#fff;border:1px solid #cbd5e1;border-radius:10px;padding:10px;cursor:grab;box-shadow:0 2px 8px rgba(0,0,0,.08)}
    .node.sel{border-color:#3467d6;box-shadow:0 0 0 3px rgba(52,103,214,.2)}
    .node.active{border-color:#d97706;box-shadow:0 0 0 4px rgba(217,119,6,.25);animation:tracePulse 280ms ease-in-out}
    .node.passed{border-color:#1a9e5c}
    @keyframes tracePulse{0%{transform:scale(1)}50%{transform:scale(1.05)}100%{transform:scale(1)}}
    .n-type{font-size:10px;text-transform:uppercase;font-weight:700;color:#3467d6;letter-spacing:.5px}
    .n-title{font-weight:600;font-size:13px;margin:2px 0}.n-spec{font-size:11px;color:#64748b}
    .inspector{background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:14px;height:fit-content}
    .field{margin-bottom:10px}.field label{display:block;font-size:12px;font-weight:600;margin-bottom:4px}
    input,select,textarea{width:100%;box-sizing:border-box;padding:7px;border-radius:6px;border:1px solid #cbd5e1;font-size:13px}
    .btn{padding:7px 14px;border-radius:8px;border:1px solid #cbd5e1;background:#fff;cursor:pointer;font-size:13px}
    .btn.danger{color:#c0392b;border-color:#f3c1c1}.muted{color:#64748b;font-size:12px}.hint{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)}
    .row{display:grid;grid-template-columns:1fr 1fr;gap:8px}
    .muted.ok{color:#1a9e5c}
  `]
})
export class WorkflowBuilderComponent {
  @Input() definitionJson = '[]';
  @Output() changedJson = new EventEmitter<string>();
  types = TYPES; selType = 'AI Action'; sel?: WfNode;
  nodes: WfNode[] = [];
  edges: { d: string }[] = [];
  traceIndex = -1; traceRunning = false; traceDone = false;
  private traceTimer?: ReturnType<typeof setTimeout>;

  ngOnInit() { this.load(); }
  private load() {
    try {
      const def = JSON.parse(this.definitionJson || '{}');
      const steps = def.steps ?? (Array.isArray(def) ? def : []);
      this.nodes = steps.map((s: any, i: number) => ({
        id: s.id ?? `n${i}`, type: s.type ?? 'AI Action', title: s.title ?? s.type ?? `Step ${i + 1}`,
        spec: s.spec ?? s.execution ?? '', retries: s.retries ?? 2, x: 40 + (i % 3) * 220, y: 40 + Math.floor(i / 3) * 140,
      }));
    } catch { this.nodes = []; }
    this.rebuildEdges();
  }
  addNode() {
    const n: WfNode = { id: `n${Date.now()}`, type: this.selType, title: `${this.selType} step`, spec: '', retries: 2, x: 60 + this.nodes.length * 40 % 300, y: 60 + this.nodes.length * 60 % 260 };
    this.nodes.push(n); this.sel = n; this.rebuildEdges(); this.changed();
  }
  removeNode(n: WfNode) { this.nodes = this.nodes.filter(x => x !== n); if (this.sel === n) this.sel = undefined; this.rebuildEdges(); this.changed(); }
  autoLayout() { this.nodes.forEach((n, i) => { n.x = 40 + (i % 3) * 220; n.y = 40 + Math.floor(i / 3) * 140; }); this.rebuildEdges(); this.changed(); }
  private rebuildEdges() {
    this.edges = this.nodes.slice(0, -1).map((n, i) => {
      const m = this.nodes[i + 1];
      const x1 = n.x + 180, y1 = n.y + 30, x2 = m.x, y2 = m.y + 30, cx = (x1 + x2) / 2;
      return { d: `M${x1},${y1} C${cx},${y1} ${cx},${y2} ${x2},${y2}` };
    });
  }
  changed() {
    this.rebuildEdges();
    const def = { steps: this.nodes.map(n => ({ id: n.id, type: n.type.toLowerCase().replace(' ', '-'), title: n.title, spec: n.spec, retries: n.retries })) };
    this.changedJson.emit(JSON.stringify(def));
  }

  /** Sequentially highlight each node (~280ms/step) to simulate a live execution trace (US-7.1). */
  runTrace() {
    clearTimeout(this.traceTimer);
    this.traceDone = false; this.traceRunning = true; this.traceIndex = -1;
    const step = (i: number) => {
      if (i >= this.nodes.length) { this.traceRunning = false; this.traceDone = true; this.traceIndex = -1; return; }
      this.traceIndex = i;
      this.traceTimer = setTimeout(() => step(i + 1), 280);
    };
    step(0);
  }
}
