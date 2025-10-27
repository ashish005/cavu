// ******************** Dialog ********************//
export class AlertDialog {
    constructor(
        public message: string,
        public type: DialogType,
        public okCallback?: (val?: string) => void,
        public cancelCallback?: () => void,
        public defaultValue?: string,
        public okLabel?: string,
        public cancelLabel?: string) {

    }
}

export enum DialogType {
    alert,
    confirm,
    prompt
}
// ******************** End ********************//


// ******************** Growls ********************//
export class AlertCommand {
    constructor(
        public operation: 'clear' | 'add' | 'add_sticky',
        public message?: AlertMessage,
        public onRemove?: () => any) { }
}

export class AlertMessage {
    constructor(public severity: MessageSeverity, public summary: string, public detail: string) { }
}

export enum MessageSeverity {
    default,
    info,
    success,
    error,
    warn,
    wait
}
// ******************** End ********************//
