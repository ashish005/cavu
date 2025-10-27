import {
    ClientContactCell,
    ClientContactNameActionCell, ClientContactPrimaryCell,
    ClientDueInfoCell,
    ClientNameActionCell,
    ClientPaymentModeCell, ClientRegInfoCell
} from "./client-grid-cell.component";

const CLIENT_GRID_COLUMN_CELL_COMPONENTS = [
    ClientNameActionCell, ClientContactNameActionCell, ClientContactCell, ClientRegInfoCell,
    ClientPaymentModeCell, ClientContactPrimaryCell, ClientDueInfoCell
];


export const GRID_COLUMN_CELL_COMPONENTS = [
    CLIENT_GRID_COLUMN_CELL_COMPONENTS
];
