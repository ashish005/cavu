import { Injectable } from '@angular/core';
import { TitleStrategy, RouterStateSnapshot } from '@angular/router';
import { Title } from '@angular/platform-browser';
import {StringHelper} from "./helpers";

@Injectable()
export class AppTitleService extends TitleStrategy {
    static appName: string | undefined;

    constructor(private readonly titleService: Title) { super(); }

    override updateTitle(routerState: RouterStateSnapshot) {
        let title = this.buildTitle(routerState);

        if (title) {
            const fragment = routerState.url.split('#')[1];

            if (fragment) {
                title += ` | ${StringHelper.toTitleCase(fragment)}`;
            }

            if (AppTitleService.appName) {
                title += ` - ${AppTitleService.appName}`;
            }

            this.titleService.setTitle(title);

        } else if (AppTitleService.appName) {
            this.titleService.setTitle(AppTitleService.appName);
        }
    }
}
