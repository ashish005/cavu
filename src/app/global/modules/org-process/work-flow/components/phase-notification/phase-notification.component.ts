import {Component, Input, TemplateRef, ViewChild} from "@angular/core";
import {Phase, ProcessNode} from "../../models";

@Component({
  standalone: false,
  templateUrl: "./phase-notification.html",
  styles: [`:host{ display: contents; }`]
})
export class PhaseNotificationComponent {
  @ViewChild("footerTemplate", { static: true }) footerTemplate!: TemplateRef<any>;

  @Input() process?: ProcessNode;
  @Input() phase?: Phase;

  onOk: (payload?: any) => void;
  onCancel: () => void;

  notifyOnEnter: boolean = true;
  notifyOnExit: boolean = false;

  availableChannels: Array<{ id: string; name: string }> = [
    { id: "inApp", name: "In-app" },
    { id: "email", name: "Email" },
    { id: "sms", name: "SMS" }
  ];

  selectedChannels: string[] = ["inApp"];

  message: string = "";

  toggleChannel(id: string) {
    const index = this.selectedChannels.indexOf(id);
    if (index > -1) {
      this.selectedChannels = this.selectedChannels.filter(x => x !== id);
    } else {
      this.selectedChannels = [...this.selectedChannels, id];
    }
  }

  isChannelSelected(id: string): boolean {
    return this.selectedChannels.indexOf(id) > -1;
  }

  save() {
    if (this.onOk) {
      const payload = {
        processId: this.process?.id,
        phaseId: this.phase?.id,
        notifyOnEnter: this.notifyOnEnter,
        notifyOnExit: this.notifyOnExit,
        channels: this.selectedChannels,
        message: this.message
      };
      this.onOk(payload);
    }
  }

  close() {
    if (this.onCancel) {
      this.onCancel();
    }
  }
}

