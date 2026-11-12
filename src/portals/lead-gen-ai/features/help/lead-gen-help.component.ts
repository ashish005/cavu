import { Component } from '@angular/core';

interface HelpSection { title: string; icon: string; items: { q: string; a: string }[]; }

@Component({
  selector: 'lead-gen-help',
  templateUrl: './lead-gen-help.component.html',
  styleUrls: ['./lead-gen-help.component.scss'],
  standalone: false
})
export class LeadGenHelpComponent {
  sections: HelpSection[] = [
    {
      title: 'Getting started', icon: 'fa fa-rocket',
      items: [
        { q: 'How do I log in?', a: 'Open the app URL (e.g. rms.localhost:4200), enter your username and password on the login screen, and submit. Use demo-admin / Password@123 for the demo account.' },
        { q: 'I see empty screens — where is the data?', a: 'Go to Operations → Load demo data (or Setup → launch step). This seeds leads, campaigns, appointments, agents, and conversations for the selected business.' },
        { q: 'How do I switch between client businesses?', a: 'Use the business selector in the top bar — it filters every screen to that business.' }
      ]
    },
    {
      title: 'Screens', icon: 'fa fa-desktop',
      items: [
        { q: 'What is each screen for?', a: 'Overview = dashboard stats. Contacts & Leads = lead list + detail. Pipeline = kanban board. Conversations = unified inbox. Appointments = calendar & booking. AI Agents / Workflows / Voice AI = automation. Campaigns = outreach. Prospecting = lead discovery. Analytics = reports. Integrations / Billing / Operations = admin & system. Candidate = job applications.' },
        { q: 'How do I create a record?', a: 'Every screen has a "+ New …" button that opens a popup form. Fill it and save — the list refreshes automatically.' },
        { q: 'How do I edit or act on a row?', a: 'Click a row in any grid to select it — an action bar appears below with the available actions (edit, run, delete-equivalent).' }
      ]
    },
    {
      title: 'Troubleshooting', icon: 'fa fa-wrench',
      items: [
        { q: 'Screens show "Request failed" or nothing loads', a: 'Check that the API is running on localhost:5260 and you are logged in. A 401 means your session expired — log in again.' },
        { q: 'I see "Required parameter Guid cb was not provided"', a: 'This was a backend bug — it is fixed. Restart the API if you still see it.' },
        { q: 'A popup form shows an error on save', a: 'Read the red message inside the popup — it shows the API\'s reason (e.g. validation, missing field).' },
        { q: 'The page looks broken after an update', a: 'Hard-refresh with Cmd+Shift+R to clear the cached build.' }
      ]
    }
  ];
}
