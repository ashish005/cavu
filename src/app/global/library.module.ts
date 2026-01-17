import {ErrorHandler, inject, ModuleWithProviders, NgModule} from "@angular/core";
import {
    DefaultUrlSerializer,
    RouterLink, RouterLinkActive,
    RouterModule,
    ROUTES,
    TitleStrategy,
    UrlSerializer,
    UrlTree
} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
// import {ScrollingModule} from "@angular/cdk/scrolling";
import {NgbModule, NgbPopoverModule, NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
// import {AngularEditorModule} from "@kolkov/angular-editor";
// import {PopoverModule} from "ngx-bootstrap/popover";
// import {ModalModule} from "ngx-bootstrap/modal";
// import {NgSelectModule} from "@ng-select/ng-select";
// import {TooltipModule} from "ngx-bootstrap/tooltip";
import {ToastaModule} from "ngx-toasta";

import {GLOBAL_PIPES} from "./pipes";
import {AppTitleService} from "./app-title.service";
import {UtilHelper} from "./helpers";
import {PopupService} from "./popup-module";

import {AppErrorHandler} from "./modules/error-handler/app-error.handler";
import {GLOBAL_DIRECTIVES} from "./directives";
import {GLOBAL_COMPONENTS} from "./components/shared_components";
import {SharedService} from "./shared.service";
import {TranslateModule} from "@ngx-translate/core";
import {DEPENDENT_COMPONENTS, DEPENDENT_MODULES} from "./modules";
import {CoreProcessFactory} from "./pluginFactory";
import {CdkTableModule} from "@angular/cdk/table";
import {CdkTreeModule} from "@angular/cdk/tree";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {NgSelectModule} from "@ng-select/ng-select";
import {ScrollingModule} from "@angular/cdk/scrolling";
import {NgxGraphModule} from "@swimlane/ngx-graph";

const COMMON_MODULE = [
    CdkTableModule, CdkTreeModule, DragDropModule,
    ScrollingModule, NgxGraphModule
];

class LowerCaseUrlSerializer extends DefaultUrlSerializer {
    override parse(url: string): UrlTree {
        const possibleSeparators = /[?;#]/;
        const indexOfSeparator = url.search(possibleSeparators);
        let processedUrl: string;
        if (indexOfSeparator > -1) {
            const separator = url.charAt(indexOfSeparator);
            const urlParts = UtilHelper.splitInTwo(url, separator);
            urlParts.firstPart = urlParts.firstPart.toLowerCase();

            processedUrl = urlParts.firstPart + separator + urlParts.secondPart;
        } else {
            processedUrl = url.toLowerCase();
        }
        return super.parse(processedUrl);
    }
}
function getBaseUrl() { return document.getElementsByTagName('base')[0].href; }
@NgModule({
    imports: [
        CommonModule, RouterModule,
        FormsModule, ReactiveFormsModule,
        TranslateModule, COMMON_MODULE,
        // NgSelectModule,
        NgbModule, NgbPopoverModule, NgbTooltipModule, //NgbCarouselModule, NgbModalModule, NgChartsModule,
        //ScrollingModule,
        // AngularEditorModule,
        ToastaModule,
        //ModalModule,
        //TooltipModule,
        // PopoverModule,
      GLOBAL_COMPONENTS, GLOBAL_DIRECTIVES, GLOBAL_PIPES, DEPENDENT_MODULES
    ],
    providers: [
      GLOBAL_PIPES,
      PopupService, SharedService, CoreProcessFactory,
        { provide: TitleStrategy, useClass: AppTitleService },
        { provide: UrlSerializer, useClass: LowerCaseUrlSerializer },
        { provide: ErrorHandler, useClass: AppErrorHandler },
        { provide: 'BASE_URL', useFactory: getBaseUrl }
    ],
    declarations: [ ...DEPENDENT_COMPONENTS ],
    exports: [
      CommonModule,
        // RouterModule,
        // FormsModule, ReactiveFormsModule, TranslateModule,
        // ScrollingModule,
        NgSelectModule,
        NgbModule, NgbPopoverModule, NgbTooltipModule, COMMON_MODULE, //NgbCarouselModule, NgbModalModule, NgChartsModule,
        // AngularEditorModule,
        // ToastaModule,
      GLOBAL_COMPONENTS, GLOBAL_DIRECTIVES, GLOBAL_PIPES, DEPENDENT_COMPONENTS,
      DEPENDENT_MODULES
    ]
})
export class GlobalModule {}
