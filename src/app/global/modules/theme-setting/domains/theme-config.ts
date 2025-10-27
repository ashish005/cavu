export class LayoutOptions {
    id: string;
    class: string;
    displayName: string;
    isChecked: boolean;
    targetElement: string;

    constructor(model) {
        this.id = model.id || '';
        this.class = model.class || '';
        this.displayName = model.displayName || '';
        this.isChecked = model.isChecked || false;
        this.targetElement = model.targetElement;
    }
}

export class ColorOptions {
    class: string;
    displayName: string;
    value: string;

    constructor(model = <any>{}) {
        this.class = model.class || '';
        this.displayName = model.displayName || '';
        this.value = model.value || '';
    }
}
