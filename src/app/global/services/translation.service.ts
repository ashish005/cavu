import {inject, Injectable, Injector} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { Observable, Subject, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private onLanguageChanged = new Subject<string>();
  languageChanged$ = this.onLanguageChanged.asObservable();

  constructor(public translate: TranslateService) {
    this.addLanguages(['en', 'fr', 'de', 'pt', 'ar', 'ko', 'es', 'hi']);
    this.setDefaultLanguage('en');
  }

  addLanguages(lang: string[]) { this.translate.addLangs(lang); }

  setDefaultLanguage(lang: string) { this.translate.setDefaultLang(lang); }

  getDefaultLanguage() { return this.translate.defaultLang; }

  getBrowserLanguage() { return this.translate.getBrowserLang(); }

  getCurrentLanguage() { return this.translate.currentLang; }

  getLoadedLanguages() { return this.translate.langs; }

  useBrowserLanguage(): string | void {
    const browserLang = this.getBrowserLanguage();

    if (browserLang.match(/en|fr|de|pt|ar|ko|es|hi/)) {
      this.changeLanguage(browserLang);
      return browserLang;
    }
  }

  useDefaultLangage() {
    return this.changeLanguage(null);
  }

  changeLanguage(language: string) {
    if (!language) {
      language = this.getDefaultLanguage();
    }

    if (language != this.translate.currentLang) {
      setTimeout(() => {
        this.translate.use(language);
        this.onLanguageChanged.next(language);
      });
    }
    return language;
  }

  getTranslation(key: string | Array<string>, interpolateParams?: Object): string | any {
    return this.translate.instant(key, interpolateParams);
  }

  getTranslationAsync(key: string | Array<string>, interpolateParams?: Object): Observable<string | any> {
    return this.translate.get(key, interpolateParams);
  }
}