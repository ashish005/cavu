import {Component, DestroyRef, OnInit, TemplateRef, ViewChild, inject} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {finalize} from "rxjs";
import {AlertService, MessageSeverity} from "@app-global";
import {financeErrorOf} from "../../services/finance-api.service";
import {InventoryApiService} from "../inventory-api.service";
import {InventorySettings, ItemCategory, ItemCategoryInput, Warehouse, WarehouseInput} from "../inventory.models";

/**
 * Products › Setup: warehouses of this branch (one is the default for documents that name none), item categories, and
 * inventory preferences (negative stock, low-stock alerts).
 */
@Component({standalone: false, templateUrl: './templates/inventory-setup.html'})
export class FinanceInventorySetupView implements OnInit {
    @ViewChild('pageTitleTemplate', {static: true}) pageTitleTemplate!: TemplateRef<any>;
    @ViewChild('actionTemplate', {static: true}) actionTemplate!: TemplateRef<any>;
    private readonly destroyRef = inject(DestroyRef);

    warehouses: Warehouse[] = [];
    categories: ItemCategory[] = [];
    settings: InventorySettings | null = null;
    warehouseForm: {id: string | null; model: WarehouseInput} | null = null;
    categoryForm: {id: string | null; model: ItemCategoryInput} | null = null;
    busy = false;
    error: string | null = null;
    formError: string | null = null;

    constructor(private api: InventoryApiService, private alerts: AlertService) {}

    get topCategories() { return this.categories.filter(c => !c.parentId && c.id !== this.categoryForm?.id); }

    ngOnInit() {
        this.loadWarehouses(false);
        this.loadCategories(false);
        this.api.settings().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({next: s => this.settings = s, error: e => this.error = financeErrorOf(e, 'Settings could not be loaded.')});
    }

    private loadWarehouses(refresh = true) {
        this.api.warehouses(refresh).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({next: w => this.warehouses = w, error: e => this.error = financeErrorOf(e, 'Warehouses could not be loaded.')});
    }
    private loadCategories(refresh = true) {
        this.api.categories(refresh).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({next: c => this.categories = c, error: e => this.error = financeErrorOf(e, 'Categories could not be loaded.')});
    }

    // ---------- Warehouses ----------

    addWarehouse() { this.formError = null; this.warehouseForm = {id: null, model: {code: '', name: '', address: null, isDefault: false, isActive: true}}; }
    editWarehouse(w: Warehouse) {
        this.formError = null;
        this.warehouseForm = {id: w.id, model: {code: w.code, name: w.name, address: w.address, isDefault: w.isDefault, isActive: w.isActive}};
    }

    saveWarehouse() {
        const f = this.warehouseForm;
        if (!f) { return; }
        if (!f.model.code?.trim() || !f.model.name?.trim()) { this.formError = 'Enter the code and name.'; return; }
        this.busy = true;
        this.api.saveWarehouse(f.id, f.model).pipe(finalize(() => this.busy = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => { this.warehouseForm = null; this.loadWarehouses(); this.alerts.showMessage('Saved', 'Warehouse saved.', MessageSeverity.success); },
            error: e => this.formError = financeErrorOf(e, 'The warehouse could not be saved.')
        });
    }

    deleteWarehouse() {
        const f = this.warehouseForm;
        if (!f?.id || !confirm(`Delete ${f.model.name}? Warehouses with stock history can only be deactivated.`)) { return; }
        this.busy = true;
        this.api.deleteWarehouse(f.id).pipe(finalize(() => this.busy = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => { this.warehouseForm = null; this.loadWarehouses(); },
            error: e => this.formError = financeErrorOf(e, 'The warehouse could not be deleted.')
        });
    }

    // ---------- Categories ----------

    addCategory() { this.formError = null; this.categoryForm = {id: null, model: {name: '', parentId: null, description: null}}; }
    editCategory(c: ItemCategory) { this.formError = null; this.categoryForm = {id: c.id, model: {name: c.name, parentId: c.parentId, description: c.description}}; }

    saveCategory() {
        const f = this.categoryForm;
        if (!f) { return; }
        if (!f.model.name?.trim()) { this.formError = 'Enter the name.'; return; }
        this.busy = true;
        this.api.saveCategory(f.id, f.model).pipe(finalize(() => this.busy = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => { this.categoryForm = null; this.loadCategories(); },
            error: e => this.formError = financeErrorOf(e, 'The category could not be saved.')
        });
    }

    deleteCategory() {
        const f = this.categoryForm;
        if (!f?.id || !confirm(`Delete ${f.model.name}? Its items stay, without a category.`)) { return; }
        this.busy = true;
        this.api.deleteCategory(f.id).pipe(finalize(() => this.busy = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => { this.categoryForm = null; this.loadCategories(); },
            error: e => this.formError = financeErrorOf(e, 'The category could not be deleted.')
        });
    }

    // ---------- Preferences ----------

    saveSettings() {
        if (!this.settings) { return; }
        this.busy = true;
        this.api.saveSettings(this.settings).pipe(finalize(() => this.busy = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: s => { this.settings = s; this.alerts.showMessage('Saved', 'Inventory preferences saved.', MessageSeverity.success); },
            error: e => this.error = financeErrorOf(e, 'Preferences could not be saved.')
        });
    }
}
