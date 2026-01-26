import {Inject, Injectable} from '@angular/core';
import {DOCUMENT} from "@angular/common";
import {OrgTheme} from "../domains/theme-setup.serializer";
import {ColorOptions, LayoutOptions} from "../domains/theme-config";

interface AppTheme {
    id: number;
    name: string;
    href: string;
    isDefault?: boolean;
    background: string;
    color: string;
    class: string;
    isDark?: boolean;
}

@Injectable({providedIn: 'root'})
export class ThemeManagerService {
    defaultTheme: OrgTheme = <OrgTheme>{
        code: "light",
        isBoxedLayout: false,
        isFixedAside: true,
        isFixedContent: true,
        isFoldedAside: false,
        isFullscreen: false,
        name: '1'
    };
    selectedBaseThemeOption: string = 'light';
    selectedThemeOption: string;
  public showThemeSetting: boolean = false;

  activeTheme: OrgTheme;
  public toggleThemeSwitcher () { this.showThemeSetting = !this.showThemeSetting; }

    constructor(@Inject(DOCUMENT) private document: Document) {}

    layouts: Array<LayoutOptions> = [
        new LayoutOptions({id: "fia", displayName: 'Fixed Aside', class: 'fixed-aside', targetElement: 'body'}),
        new LayoutOptions({id: "fic", displayName: 'Fixed Content', class: 'fixed-content', targetElement: 'body'}),
        new LayoutOptions({id: "foa", displayName: 'Folded Aside', class: 'folded', targetElement: '#aside'}),
        new LayoutOptions({id: "bol", displayName: 'Boxed Layout', class: 'container', targetElement: 'body'})
    ];

    checkUpdateClasss = (isActive, model) => {
        const htmlEl = this.document.querySelector(model.targetElement);

        if (null == htmlEl) {
            setTimeout(this.checkUpdateClasss.bind(this), 100, isActive, model);
            return
        }
        const hasClass = htmlEl.classList.contains(model.class);

        if (isActive) {
            if (!hasClass) {
                htmlEl.classList.add(model.class);
            }
        } else if (hasClass) {
            htmlEl.classList.remove(model.class);
        };
    };

    applySetting(opt: OrgTheme) {
        this.activeTheme = opt || this.defaultTheme;
        const {code, font, fontId, id, isBoxedLayout, isFixedAside, isFixedContent, isFoldedAside, isFullscreen, name} = this.activeTheme;

        const cssList: any = this.document.body.classList;
        ['light', 'dark'].forEach(baseThm => {
            if (cssList.contains(baseThm)) {
                cssList.remove(baseThm);
            }
        });
        cssList.add(code);
        this.selectedBaseThemeOption = code;

        const boxed = this.layouts.find(r => r.id === 'bol');
        const fixedAside = this.layouts.find(r => r.id === 'fia');
        const fixedContent = this.layouts.find(r => r.id === 'fic');
        const foldedAside = this.layouts.find(r => r.id === 'foa');
        this.checkUpdateClasss(isFixedAside, fixedAside);
        this.checkUpdateClasss(isFixedContent, fixedContent);
        this.checkUpdateClasss(isBoxedLayout, boxed);
        this.checkUpdateClasss(isFoldedAside, foldedAside);

        this.selectedThemeOption = name;
    }

    themesOptions: Array<ColorOptions> = [
        new ColorOptions({displayName: '', class: 'light', value: 'light'}),
        new ColorOptions({displayName: '', class: 'dark', value: 'dark'})
    ];
    themes: Array<AppTheme> = [
        {
            id: 1,
            name: 'Default',
            href: 'default.css',
            isDefault: true,
            background: '#007bff',
            color: '#fff',
            class: 'light',
            isDark: false
        },
        {id: 107, name: 'Black', href: 'black.css', background: '#007bff', color: '#fff', class: 'dark', isDark: true},
        {id: 100, name: 'Primary', href: 'primary.css', background: '#007bff', color: '#fff', class: 'primary'},
        {id: 101, name: 'Accent', href: 'accent.css', background: '#007bff', color: '#fff', class: 'accent'},
        {id: 102, name: 'Warn', href: 'warn.css', background: '#007bff', color: '#fff', class: 'warn'},
        {id: 103, name: 'Info', href: 'info.css', background: '#007bff', color: '#fff', class: 'info'},
        {id: 104, name: 'Success', href: 'success.css', background: '#007bff', color: '#fff', class: 'success'},
        {id: 105, name: 'Warning', href: 'warning.css', background: '#007bff', color: '#fff', class: 'warning'},
        {id: 106, name: 'Danger', href: 'danger.css', background: '#007bff', color: '#fff', class: 'danger'},
        /*{
          id: 2,
          name: '2',
          href: '2.css',
          background: '#2780E3',
          color: '#373a3c'
        },
        {
          id: 3,
          name: '3',
          href: '3.css',
          background: '#158CBA',
          color: '#f0f0f0'
        },
        {
          id: 4,
          name: '4',
          href: '4.css',
          background: '#2FA4E7',
          color: '#e9ecef'
        },
        {
          id: 5,
          name: '5',
          href: '5.css',
          background: '#78C2AD',
          color: '#F3969A'
        },
        {
          id: 6,
          name: '6',
          href: '6.css',
          background: '#333',
          color: 'white'
        },
        {
          id: 7,
          name: '7',
          href: '7.css',
          background: '#3A3F44',
          color: '#7A8288',
          isDark: true
        },
        {
          id: 8,
          name: '8',
          href: '8.css',
          background: '#2C3E50',
          color: '#18BC9C'
        },
        {
          id: 9,
          name: '9',
          href: '9.css',
          background: '#593196',
          color: '#A991D4'
        },
        {
          id: 10,
          name: '10',
          href: '10.css',
          background: '#446E9B',
          color: '#999'
        },
        {
          id: 11,
          name: '11',
          href: '11.css',
          background: '#E95420',
          color: '#fff'
        },
        {
          id: 12,
          name: '12',
          href: '12.css',
          background: '#EB6864',
          color: '#aaa'
        },
        {
          id: 13,
          name: '13',
          href: '13.css',
          background: '#DF691A',
          color: '#2B3E50',
          isDark: true
        },
        {
          id: 14,
          name: '14',
          href: '14.css',
          background: '#B58900',
          color: '#002B36',
          isDark: true
        }*/
    ];
    fonts: Array<any> = [
        {id: 'tnr', name: 'Times New Roman'},
        {id: 'verd', name: 'Vardana'},
    ];

    public installTheme(theme?: AppTheme) {
        if (theme == null || theme.isDefault) {
            this.removeStyle('theme');
        } else {
            this.setStyle('theme', `assets/themes/${theme.href}`);
        }
    }

    public getDefaultTheme(): AppTheme {
        return this.themes.find(theme => theme.isDefault);
    }

    public getThemeByID(id: number): AppTheme {
        return this.themes.find(theme => theme.id === id);
    }

    private setStyle(key: string, href: string) {
        this.getLinkElementForKey(key).setAttribute('href', href);
    }

    private removeStyle(key: string) {
        const existingLinkElement = this.getExistingLinkElementByKey(key);
        if (existingLinkElement) {
            document.head.removeChild(existingLinkElement);
        }
    }

    private getLinkElementForKey(key: string) {
        return this.getExistingLinkElementByKey(key) || this.createLinkElementWithKey(key);
    }

    private getExistingLinkElementByKey(key: string) {
        return document.head.querySelector(`link[rel="stylesheet"].${this.getClassNameForKey(key)}`);
    }

    private createLinkElementWithKey(key: string) {
        const linkEl = document.createElement('link');
        linkEl.setAttribute('rel', 'stylesheet');
        linkEl.classList.add(this.getClassNameForKey(key));
        document.head.appendChild(linkEl);
        return linkEl;
    }

    private getClassNameForKey(key: string) {
        return `style-manager-${key}`;
    }

    public updateThemeColor(data: any) {
        const cssList: any = this.document.body.classList;
        data.list.forEach((option: ColorOptions) => cssList.remove(option.class));
        cssList.add(data.active.class);
    }

    public updateLayout(data: LayoutOptions) {

    }
}
