import {
    ComplianceNameCellComponent, ComplianceRateCellComponent,
    ComplianceRegulatoryNameCellComponent,
    ComplianceSchedulerCellComponent, SubscriptionCellComponent
} from "./compliance-grid-cell.component";
import {
    RegulatoryCredentialCellComponent,
    RegulatoryRegCellComponent,
    RegulatoryRenewalCellComponent
} from "./regulatory-grid-cell.component";




export const COMPLIANCE_GRID_COLUMN_CELL_COMPONENTS = [
    ComplianceRegulatoryNameCellComponent, ComplianceSchedulerCellComponent,
    ComplianceNameCellComponent, ComplianceRateCellComponent,
    SubscriptionCellComponent,

    RegulatoryCredentialCellComponent, RegulatoryRegCellComponent, RegulatoryRenewalCellComponent
];
