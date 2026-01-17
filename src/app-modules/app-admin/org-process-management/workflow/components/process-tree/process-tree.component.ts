import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter, HostListener,
    Input, OnChanges,
    Output,
    QueryList, SimpleChanges,
    ViewChild,
    ViewChildren
} from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {WorkflowNode} from "../../domains/org-workflow-node.serializer";

@Component({
    selector: 'process-tree',
    standalone: false,
    templateUrl: './process-tree.html',
    //styleUrls: [`./process-tree.css`],
    animations: [
        trigger('expand', [
            transition(':enter', [
                style({ height: 0, opacity: 0 }),
                animate('200ms ease-out', style({ height: '*', opacity: 1 }))
            ])
        ])
    ],
})
export class ProcessTreeComponent implements OnChanges, AfterViewInit {
    @Input() data: WorkflowNode[] = [];
    @Output() select: EventEmitter<WorkflowNode> = new EventEmitter<WorkflowNode>();
    //@Input() userPermissions: string[] = [];

    // @ViewChild('treeScroll') treeScroll!: ElementRef;
    // @ViewChildren('treeNode') treeNodes!: QueryList<ElementRef>;

    searchText = '';
    flattenedNodes: WorkflowNode[] = [];
    selectedNode?: WorkflowNode;
    contextNode?: WorkflowNode;

    private scrollKey = 'process-tree-scroll';
    private focusedIndex = 0;

    // ngOnInit() {
    //     debugger
    //     this.rebuildTree();
    // }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['data'] && changes['data'].currentValue) {
            this.rebuildTree(); // ✅ rebuild when data arrives
        }
    }

    ngAfterViewInit() {
        /*const saved = sessionStorage.getItem(this.scrollKey);
        if (saved) {
            this.treeScroll.nativeElement.scrollTop = +saved;
        }

        this.treeScroll.nativeElement?.addEventListener('scroll', () => {
            sessionStorage.setItem(
                this.scrollKey,
                this.treeScroll.nativeElement?.scrollTop
            );
        });*/
    }

    /* ---------------- Tree ---------------- */

    rebuildTree() {
        this.flattenedNodes = [];
        this.flatten(this.data, 0);
    }

    private flatten(nodes: WorkflowNode[], level: number) {
        for (const node of nodes) {
            if (!this.hasPermission(node)) continue;

            const flat: WorkflowNode = {
                ...node,
                level,
                expanded: node.expanded ?? false,
                hasChildren: !!node.children?.length
            };

            this.flattenedNodes.push(flat);
            // if (this.matchesSearch(flat)) {
            //     this.flattenedNodes.push(flat);
            // }

            if (flat.hasChildren && flat.expanded) {
                this.flatten(node.children!, level + 1);
            }
        }
    }

    toggle(node: WorkflowNode) {
        node.expanded = !node.expanded;

        // 🔑 persist expand state back to original tree
        this.syncExpandedState(this.data!, node);
        this.rebuildTree();
    }

    expandAll(nodes: WorkflowNode[]) {
        this.setExpandState(this.data!, true);
        for (const n of nodes) {
            n.expanded = true;
            n.children && this.expandAll(n.children);
        }
    }

    collapseAll(): void {
        this.setExpandState(this.data!, false);
        this.rebuildTree();
    }

    private setExpandState(nodes: WorkflowNode[], expanded: boolean): void {
        for (const node of nodes) {
            node.expanded = expanded;
            if (node.children) {
                this.setExpandState(node.children, expanded);
            }
        }
    }

    private syncExpandedState(nodes: WorkflowNode[], flat: WorkflowNode): boolean {
        for (const node of nodes) {
            if (node.id === flat.id) {
                node.expanded = flat.expanded;
                return true;
            }
            if (node.children && this.syncExpandedState(node.children, flat)) {
                return true;
            }
        }
        return false;
    }

    selectNode(node: WorkflowNode) {
        this.selectedNode = node;
        this.focusedIndex = this.flattenedNodes.indexOf(node);

        /*setTimeout(() => {
            const el = this.treeNodes.find(
                n => n.nativeElement.dataset['id'] === node.id
            );
            el?.nativeElement?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });*/

        this.select.emit(node);
    }

    /* ---------------- Search ---------------- */

    onSearch() {
        this.expandAll(this.data);
        this.rebuildTree();
    }

    private matchesSearch(node: WorkflowNode) {
        return !this.searchText ||
            node.name.toLowerCase().includes(this.searchText.toLowerCase());
    }

    highlight(text: string) {
        if (!this.searchText) return text;
        return text.replace(
            new RegExp(`(${this.searchText})`, 'gi'),
            '<mark>$1</mark>'
        );
    }

    /* ---------------- Permissions ---------------- */

    private hasPermission(node: WorkflowNode) {
        return true;
        //return !node.permissions || node.permissions.some(p => this.userPermissions.includes(p));
    }

    /* ---------------- Drag & Drop ---------------- */

    drop(event: CdkDragDrop<WorkflowNode[]>) {
        moveItemInArray(this.flattenedNodes, event.previousIndex, event.currentIndex);
    }

    /* ---------------- Keyboard ---------------- */

    @HostListener('keydown', ['$event'])
    onKey(event: KeyboardEvent) {
        if (!this.flattenedNodes.length) return;

        if (event.key === 'ArrowDown') {
            this.focusedIndex = Math.min(this.focusedIndex + 1, this.flattenedNodes.length - 1);
            this.selectNode(this.flattenedNodes[this.focusedIndex]);
            event.preventDefault();
        }

        if (event.key === 'ArrowUp') {
            this.focusedIndex = Math.max(this.focusedIndex - 1, 0);
            this.selectNode(this.flattenedNodes[this.focusedIndex]);
            event.preventDefault();
        }

        if (event.key === 'Enter' && this.selectedNode?.hasChildren) {
            this.toggle(this.selectedNode);
        }
    }

    /* ---------------- Context Menu ---------------- */

    openContextMenu(event: MouseEvent, node: WorkflowNode) {
        event.preventDefault();
        this.contextNode = node;
    }

    closeContextMenu() {
        this.contextNode = undefined;
    }

    trackById(_: number, node: WorkflowNode) {
        return node.id;
    }

    showWorkflow(e){}
}
