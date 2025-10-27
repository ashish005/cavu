export interface UserConfiguration {
  language: string;
  homeUrl: string;
  themeId: number;
  uiSetting: OrgTheme;
  showDashboardStatistics: boolean;
  showDashboardNotifications: boolean;
  showDashboardTodo: boolean;
  showDashboardBanner: boolean;
}

export class OrgTheme {
    fontId:number;
    font: string;
    id: number | string;
    isBoxedLayout: boolean;
    isFixedAside: boolean;
    isFixedContent: boolean;
    isFoldedAside: boolean;
    isFullscreen: boolean;
    name: string;
    code: string;

    constructor(model: any = {}){
        const { id, name, code, fontId, font, isBoxedLayout, isFixedAside, isFixedContent, isFoldedAside, isFullscreen} = model;

        this.id = model.id;
        this.fontId = fontId;
        this.font = font;
        this.isBoxedLayout = isBoxedLayout;
        this.isFixedAside = isFixedAside;
        this.isFixedContent = isFixedContent;
        this.isFoldedAside = isFoldedAside;
        this.isFullscreen = isFullscreen;
        this.name = name;
        this.code = code;
    }
}

export class OrgThemeSerializer {
    fromJson(json: any): OrgTheme {
        return new OrgTheme(json);
    }

    toJson(data: any): any {
        return {
            isFixedAside: data.isFixedAside,
            isFixedContent: data.isFixedContent,
            isFoldedAside: data.isFoldedAside,
            isBoxedLayout: data.isBoxedLayout,
            isFullscreen: data.isFullscreen,
            code: data.code,
            name: data.name,
            fontId: data.fontId
        };
    }
}
