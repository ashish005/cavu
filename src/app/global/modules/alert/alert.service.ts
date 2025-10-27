import { Injectable } from '@angular/core';
import { HttpResponseBase } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import {AlertCommand, AlertDialog, DialogType, MessageSeverity} from "./alert.enum";
import {UtilHelper} from "../../helpers/util-helper";
import {FuncHelper} from "../../helpers/func-helper";

@Injectable({ providedIn: 'root' })
export class AlertService {
  private messages = new Subject<AlertCommand>();
  private dialogs = new Subject<AlertDialog>();

  private loadingMessageTimeoutId: ReturnType<typeof setTimeout> | undefined;

  showDialog(message: string): void;
  showDialog(message: string, type: DialogType, okCallback: (val?: string) => void): void;
  showDialog(message: string, type: DialogType, okCallback?: { (val?: string): void } | null, cancelCallback?: { (): void } | null, okLabel?: string | null, cancelLabel?: string | null, defaultValue?: string | null): void;
  showDialog(message: string, type?: DialogType, okCallback?: (val?: string) => void, cancelCallback?: () => void, okLabel?: string, cancelLabel?: string, defaultValue?: string) {
      if (!type) {
          type = DialogType.alert;
      }

      this.dialogs.next({ message, type, okCallback, cancelCallback, okLabel, cancelLabel, defaultValue });
  }

  showMessage(summary: string): void;
  showMessage(summary: string, detail: string | null, severity: MessageSeverity): void;
  showMessage(summaryAndDetails: string[], summaryAndDetailsSeparator: string, severity: MessageSeverity): void;
  showMessage(response: HttpResponseBase, ignoreValueUseNull: string, severity: MessageSeverity): void;
  showMessage(data: string | string[] | HttpResponseBase, separatorOrDetail?: string | null, severity?: MessageSeverity) {
      if (!severity) {
          severity = MessageSeverity.default;
      }

      if (data instanceof HttpResponseBase) {
          data = UtilHelper.getHttpResponseMessages(data);
          separatorOrDetail = UtilHelper.captionAndMessageSeparator;
      }

      if (Array.isArray(data)) {
          for (const message of data) {
              const msgObject = UtilHelper.splitInTwo(message, separatorOrDetail ?? '');

              this.showMessageHelper(msgObject.firstPart, msgObject.secondPart, severity, false);
          }
      } else {
          this.showMessageHelper(data, separatorOrDetail, severity, false);
      }
  }

  showStickyMessage(summary: string): void;
  showStickyMessage(summary: string, detail: string | null, severity: MessageSeverity, error?: unknown): void;
  showStickyMessage(summary: string, detail: string | null, severity: MessageSeverity, error?: unknown, onRemove?: () => void): void;
  showStickyMessage(summaryAndDetails: string[], summaryAndDetailsSeparator: string, severity: MessageSeverity): void;
  showStickyMessage(response: HttpResponseBase, ignoreValueUseNull: null, severity: MessageSeverity): void;
  showStickyMessage(data: string | string[] | HttpResponseBase, separatorOrDetail?: string | null, severity?: MessageSeverity, error?: unknown, onRemove?: () => void) {

      if (!severity) {
          severity = MessageSeverity.default;
      }

      if (data instanceof HttpResponseBase) {
          data = UtilHelper.getHttpResponseMessages(data);
          separatorOrDetail = UtilHelper.captionAndMessageSeparator;
      }

      if (Array.isArray(data)) {
          for (const message of data) {
              const msgObject = UtilHelper.splitInTwo(message, separatorOrDetail ?? '');

              this.showMessageHelper(msgObject.firstPart, msgObject.secondPart, severity, true);
          }
      } else {
          if (error) {
              const msg = `Severity: "${MessageSeverity[severity]}", Summary: "${data}", Detail: "${separatorOrDetail}", Error: "${FuncHelper.stringify(error)}"`;

              switch (severity) {
                  case MessageSeverity.default:
                      this.logInfo(msg);
                      break;
                  case MessageSeverity.info:
                      this.logInfo(msg);
                      break;
                  case MessageSeverity.success:
                      this.logMessage(msg);
                      break;
                  case MessageSeverity.error:
                      this.logError(msg);
                      break;
                  case MessageSeverity.warn:
                      this.logWarning(msg);
                      break;
                  case MessageSeverity.wait:
                      this.logTrace(msg);
                      break;
              }
          }

          this.showMessageHelper(data, separatorOrDetail, severity, true, onRemove);
      }
  }

  private showMessageHelper(summary: string, detail: string | null | undefined, severity: MessageSeverity, isSticky: boolean, onRemove?: () => void) {
      if (detail === null)
          detail = undefined;

      const alertCommand: AlertCommand = {
          operation: isSticky ? 'add_sticky' : 'add',
          message: { severity, summary, detail },
          onRemove
      };
      this.messages.next(alertCommand);
  }

  resetStickyMessage() {
      this.messages.next({ operation: 'clear' });
  }

  startLoadingMessage(message = 'Loading...', caption = '') {
      clearTimeout(this.loadingMessageTimeoutId);

      if (!caption) {
          caption = message;
          message = '';
      }

      this.loadingMessageTimeoutId = setTimeout(() => {
          this.showStickyMessage(caption, message, MessageSeverity.wait);
      }, 1000);
  }

  stopLoadingMessage() {
      clearTimeout(this.loadingMessageTimeoutId);
      this.resetStickyMessage();
  }

  logDebug(msg: unknown) { console.debug(msg);  }

  logError(msg: unknown) { console.error(msg); }

  logInfo(msg: unknown) { console.info(msg); }

  logMessage(msg: unknown) { console.log(msg); }

  logTrace(msg: unknown) { console.trace(msg); }

  logWarning(msg: unknown) { console.warn(msg); }

  getDialogEvent(): Observable<AlertDialog> { return this.dialogs.asObservable(); }

  getMessageEvent(): Observable<AlertCommand> { return this.messages.asObservable(); }
}
