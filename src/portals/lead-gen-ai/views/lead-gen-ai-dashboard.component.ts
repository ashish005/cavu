import { Component, DestroyRef, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { environment } from '@app-environments';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';
import {
  LeadGenApiService,
  ClientBusiness,
  ClientBusinessLocation,
  ClientBusinessLocationRequest,
  ClientBusinessInvitation,
  ClientBusinessReport,
  ClientBusinessRole,
  ClientBusinessUser,
  Organization,
  OrganizationRequest,
  Workspace,
  PossibleDuplicateProspect,
  Prospect,
  ProspectDuplicateConflict,
  ProspectType,
  CreateWorkspaceRequest,
  OrgMember,
  PermissionsResponse,
  BusinessProfile,
  Offering,
  TargetIndustry,
  Lead,
  LeadStage,
  DiscoveryJob,
  DiscoverySource,
  CandidateProfile,
  CandidatePreferences
} from '../services/lead-gen-api.service';
import { WorkspaceContextService } from '../services/workspace-context.service';

type ConnectionState = 'checking' | 'connected' | 'unavailable';

@Component({
  selector: 'lead-gen-ai-dashboard',
  templateUrl: './lead-gen-ai-dashboard.component.html',
  styleUrls: ['./lead-gen-ai-dashboard.component.scss'],
  standalone: false
})
export class LeadGenAiDashboardComponent implements OnInit {
  connectionState: ConnectionState = 'checking';
  lastChecked?: Date;
  prospects: Prospect[] = [];
  totalProspects = 0;
  isLoadingProspects = false;
  isSavingProspect = false;
  prospectsError = '';
  saveError = '';
  successMessage = '';
  duplicateMatches: PossibleDuplicateProspect[] = [];
  duplicateWarning = '';
  organization?: Organization;
  organizationNeedsSetup = false;
  isLoadingOrganization = false;
  isSavingOrganization = false;
  isDeactivatingOrganization = false;
  organizationError = '';
  organizationMessage = '';
  clientBusinesses: ClientBusiness[] = [];
  selectedClientBusinessId = '';
  clientBusinessUsers: ClientBusinessUser[] = [];
  clientBusinessInvitations: ClientBusinessInvitation[] = [];
  isLoadingClientBusinesses = false;
  isLoadingClientBusinessUsers = false;
  isSavingClientBusiness = false;
  isSavingClientBusinessUser = false;
  isLoadingInvitations = false;
  isSavingInvitation = false;
  locations: ClientBusinessLocation[] = [];
  isLoadingLocations = false;
  isSavingLocation = false;
  locationError = '';
  locationMessage = '';
  editingLocationId = '';
  private locationLoadGeneration = 0;
  private invitationLoadGeneration = 0;
  clientBusinessesError = '';
  clientBusinessUsersError = '';
  invitationsError = '';
  invitationMessage = '';
  clientBusinessMessage = '';
  workspaces: Workspace[] = [];
  selectedWorkspaceId = '';
  selectedWorkspaceClientBusinessId = '';
  isLoadingWorkspaces = false;
  isSavingWorkspace = false;
  clientBusinessReport?: ClientBusinessReport;
  reportClientBusinessId = '';
  isLoadingReport = false;
  reportError = '';
  workspaceError = '';
  workspaceMessage = '';
  readonly clientBusinessRoles: ClientBusinessRole[] = ['Viewer', 'Editor', 'ClientAdmin'];
  readonly openApiUrl: string;
  readonly showOpenApi = !environment.production;
  readonly prospectForm = this.formBuilder.group({
    type: this.formBuilder.nonNullable.control<ProspectType>('B2B'),
    name: this.formBuilder.nonNullable.control('', [Validators.required, Validators.maxLength(200)]),
    email: this.formBuilder.control('', [Validators.email, Validators.maxLength(320)]),
    phone: this.formBuilder.control('', Validators.maxLength(50)),
    website: this.formBuilder.control('', Validators.maxLength(500)),
    industry: this.formBuilder.control('', Validators.maxLength(120)),
    locationId: this.formBuilder.nonNullable.control('')
  });
  readonly organizationForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(200)]],
    slug: ['', [Validators.required, Validators.maxLength(100), Validators.pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)]],
    defaultTimeZoneId: ['America/Los_Angeles', [Validators.required, Validators.maxLength(100)]]
  });
  readonly clientBusinessForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(200)]],
    slug: ['', [Validators.required, Validators.maxLength(100), Validators.pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)]],
    countryCode: ['US', [Validators.required, Validators.pattern(/^[A-Za-z]{2}$/)]],
    defaultTimeZoneId: ['America/Los_Angeles', [Validators.required, Validators.maxLength(100)]]
  });
  readonly clientBusinessUserForm = this.formBuilder.nonNullable.group({
    userId: ['', [Validators.required, Validators.pattern(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)]],
    role: this.formBuilder.nonNullable.control<ClientBusinessRole>('Viewer')
  });
  readonly invitationForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email, Validators.maxLength(320)]],
    role: this.formBuilder.nonNullable.control<ClientBusinessRole>('Viewer')
  });
  readonly workspaceForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(200)]],
    timeZoneId: ['America/Los_Angeles', [Validators.required, Validators.maxLength(100)]],
    clientBusinessIds: this.formBuilder.nonNullable.control<string[]>([], Validators.minLength(1))
  });
  readonly locationForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(200)]],
    code: ['', Validators.maxLength(50)],
    addressLine1: ['', [Validators.required, Validators.maxLength(200)]],
    addressLine2: ['', Validators.maxLength(200)],
    city: ['', [Validators.required, Validators.maxLength(120)]],
    region: ['', Validators.maxLength(120)],
    postalCode: ['', Validators.maxLength(30)],
    countryCode: ['US', [Validators.required, Validators.pattern(/^[A-Za-z]{2}$/)]],
    timeZoneId: ['America/Los_Angeles', [Validators.required, Validators.maxLength(100)]],
    operatingHours: ['', Validators.maxLength(2000)]
  });

  constructor(
    private readonly api: LeadGenApiService,
    private readonly formBuilder: FormBuilder,
    private readonly workspaceContext: WorkspaceContextService,
    destroyRef: DestroyRef
  ) {
    this.openApiUrl = this.api.getOpenApiUrl();
    this.prospectForm.valueChanges.pipe(takeUntilDestroyed(destroyRef)).subscribe(() => {
      this.duplicateMatches = [];
      this.duplicateWarning = '';
    });
  }

  get selectedWorkspace(): Workspace | undefined {
    return this.workspaces.find(workspace => workspace.id === this.selectedWorkspaceId);
  }

  get selectedClientBusiness(): ClientBusiness | undefined {
    return this.clientBusinesses.find(business => business.id === this.selectedClientBusinessId);
  }

  get canManageAnyClientBusiness(): boolean {
    return this.clientBusinesses.some(business => business.canManage);
  }

  ngOnInit(): void {
    this.acceptInvitationFromUrl();
    this.refreshConnection();
    this.loadOrganization();
    this.loadClientBusinesses();
    this.loadWorkspaces();
    this.loadProspects();
    this.loadOrgMembers();
    this.loadDiscovery();
    this.loadCandidate();
  }

  loadOrganization(): void {
    this.isLoadingOrganization = true;
    this.organizationError = '';
    this.api.getOrganization().pipe(finalize(() => this.isLoadingOrganization = false)).subscribe({
      next: (organization) => {
        this.organization = organization;
        this.organizationNeedsSetup = false;
        this.organizationForm.setValue({
          name: organization.name,
          slug: organization.slug,
          defaultTimeZoneId: organization.defaultTimeZoneId
        });
        this.loadClientBusinessUsers(this.selectedClientBusinessId);
      },
      error: (error) => {
        if (error instanceof HttpErrorResponse && error.status === 404) {
          this.organization = undefined;
          this.organizationNeedsSetup = true;
          return;
        }
        this.organizationError = this.getRequestError(error);
      }
    });
  }

  saveOrganization(): void {
    if (this.organizationForm.invalid || this.isSavingOrganization) {
      this.organizationForm.markAllAsTouched();
      return;
    }

    const request: OrganizationRequest = this.organizationForm.getRawValue();
    this.isSavingOrganization = true;
    this.organizationError = '';
    this.organizationMessage = '';
    const save = this.organizationNeedsSetup
      ? this.api.createOrganization(request)
      : this.api.updateOrganization(request);

    save.pipe(finalize(() => this.isSavingOrganization = false)).subscribe({
      next: (organization) => {
        this.organization = organization;
        this.organizationNeedsSetup = false;
        this.organizationMessage = 'Organization profile saved.';
      },
      error: (error) => {
        this.organizationError = this.getRequestError(error);
      }
    });
  }

  deactivateOrganization(): void {
    if (!this.organization?.isOwner || this.isDeactivatingOrganization
      || !window.confirm('Deactivate this organization? API access for this organization will be blocked.')) {
      return;
    }

    this.isDeactivatingOrganization = true;
    this.organizationError = '';
    this.api.deactivateOrganization().pipe(finalize(() => this.isDeactivatingOrganization = false)).subscribe({
      next: () => {
        this.organizationMessage = 'Organization deactivated. Its API access is now blocked.';
        this.organization = undefined;
        this.organizationNeedsSetup = false;
      },
      error: (error) => {
        this.organizationError = this.getRequestError(error);
      }
    });
  }

  loadClientBusinesses(): void {
    this.isLoadingClientBusinesses = true;
    this.clientBusinessesError = '';
    this.api.listClientBusinesses().pipe(finalize(() => this.isLoadingClientBusinesses = false)).subscribe({
      next: (businesses) => {
        this.clientBusinesses = businesses;
        if (!businesses.some(business => business.id === this.selectedClientBusinessId)) {
          this.selectedClientBusinessId = businesses[0]?.id ?? '';
        }
        if (this.workspaceForm.controls.clientBusinessIds.value.length === 0) {
          const manageableBusiness = businesses.find(business => business.canManage);
          if (manageableBusiness) {
            this.workspaceForm.controls.clientBusinessIds.setValue([manageableBusiness.id]);
          }
        }
        this.loadClientBusinessUsers(this.selectedClientBusinessId);
        this.loadClientBusinessLocations(this.selectedClientBusinessId);
        this.loadBusinessConfig();
        this.loadLeads();
        this.loadClientBusinessInvitations(this.selectedClientBusinessId);
        if (!businesses.some(business => business.id === this.reportClientBusinessId)) {
          this.reportClientBusinessId = '';
        }
        this.loadClientBusinessReport();
      },
      error: (error) => {
        this.clientBusinessesError = this.getRequestError(error);
      }
    });
  }

  loadWorkspaces(): void {
    this.isLoadingWorkspaces = true;
    this.workspaceError = '';
    this.api.listWorkspaces().pipe(finalize(() => this.isLoadingWorkspaces = false)).subscribe({
      next: (workspaces) => {
        this.workspaces = workspaces;
        const selected = workspaces.find(workspace => workspace.id === this.selectedWorkspaceId)
          ?? workspaces[0];
        this.selectedWorkspaceId = selected?.id ?? '';
        this.selectedWorkspaceClientBusinessId =
          selected?.clientBusinesses.find(client => client.id === this.selectedWorkspaceClientBusinessId)?.id
          ?? selected?.clientBusinesses[0]?.id
          ?? '';
        this.updateActiveWorkspaceContext();
        this.loadProspects();
      },
      error: (error) => {
        this.workspaceError = this.getRequestError(error);
        this.workspaces = [];
        this.selectedWorkspaceId = '';
        this.selectedWorkspaceClientBusinessId = '';
        this.updateActiveWorkspaceContext();
        this.loadProspects();
      }
    });
  }

  selectWorkspace(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedWorkspaceId = select.value;
    const selected = this.workspaces.find(workspace => workspace.id === this.selectedWorkspaceId);
    this.selectedWorkspaceClientBusinessId = selected?.clientBusinesses[0]?.id ?? '';
    this.updateActiveWorkspaceContext();
    this.loadProspects();
  }

  selectWorkspaceClientBusiness(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedWorkspaceClientBusinessId = select.value;
    this.updateActiveWorkspaceContext();
    this.loadProspects();
  }

  onWorkspaceClientBusinessSelection(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const clientBusinessIds = Array.from(select.selectedOptions, option => option.value);
    this.workspaceForm.controls.clientBusinessIds.setValue(clientBusinessIds);
    this.workspaceForm.controls.clientBusinessIds.markAsDirty();
  }

  createWorkspace(): void {
    if (this.workspaceForm.invalid || this.isSavingWorkspace) {
      this.workspaceForm.markAllAsTouched();
      return;
    }

    const request: CreateWorkspaceRequest = this.workspaceForm.getRawValue();
    this.isSavingWorkspace = true;
    this.workspaceError = '';
    this.workspaceMessage = '';
    this.api.createWorkspace(request).pipe(finalize(() => this.isSavingWorkspace = false)).subscribe({
      next: (workspace) => {
        this.workspaces = [...this.workspaces, workspace].sort((a, b) => a.name.localeCompare(b.name));
        this.selectedWorkspaceId = workspace.id;
        this.selectedWorkspaceClientBusinessId = workspace.clientBusinesses[0]?.id ?? '';
        this.workspaceMessage = 'Workspace created and linked to the selected client businesses.';
        const manageableBusiness = this.clientBusinesses.find(business => business.canManage);
        this.workspaceForm.reset({
          name: '',
          timeZoneId: this.organization?.defaultTimeZoneId ?? 'America/Los_Angeles',
          clientBusinessIds: manageableBusiness ? [manageableBusiness.id] : []
        });
        this.updateActiveWorkspaceContext();
        this.loadProspects();
      },
      error: (error) => this.workspaceError = this.getRequestError(error)
    });
  }

  private updateActiveWorkspaceContext(): void {
    if (this.selectedWorkspaceId && this.selectedWorkspaceClientBusinessId) {
      this.selectedClientBusinessId = this.selectedWorkspaceClientBusinessId;
      this.workspaceContext.setActive({
        workspaceId: this.selectedWorkspaceId,
        clientBusinessId: this.selectedWorkspaceClientBusinessId
      });
      this.loadClientBusinessUsers(this.selectedClientBusinessId);
      this.loadClientBusinessLocations(this.selectedClientBusinessId);
        this.loadBusinessConfig();
        this.loadLeads();
      this.loadClientBusinessInvitations(this.selectedClientBusinessId);
      return;
    }

    this.workspaceContext.clear();
    this.loadClientBusinessLocations(this.selectedClientBusinessId);
        this.loadBusinessConfig();
        this.loadLeads();
  }

  selectClientBusiness(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedClientBusinessId = select.value;
    this.loadClientBusinessUsers(this.selectedClientBusinessId);
    this.loadClientBusinessLocations(this.selectedClientBusinessId);
        this.loadBusinessConfig();
        this.loadLeads();
    this.loadClientBusinessInvitations(this.selectedClientBusinessId);
  }

  loadClientBusinessInvitations(clientBusinessId: string): void {
    const generation = ++this.invitationLoadGeneration;
    this.clientBusinessInvitations = [];
    this.invitationsError = '';
    this.invitationMessage = '';
    if (!clientBusinessId || !this.clientBusinesses.find(business => business.id === clientBusinessId)?.canManage) {
      this.isLoadingInvitations = false;
      return;
    }

    this.isLoadingInvitations = true;
    this.api.listClientBusinessInvitations(clientBusinessId)
      .pipe(finalize(() => {
        if (generation === this.invitationLoadGeneration) {
          this.isLoadingInvitations = false;
        }
      }))
      .subscribe({
        next: invitations => {
          if (generation === this.invitationLoadGeneration) {
            this.clientBusinessInvitations = invitations;
          }
        },
        error: error => {
          if (generation === this.invitationLoadGeneration) {
            this.invitationsError = this.getRequestError(error);
          }
        }
      });
  }

  selectReportClientBusiness(event: Event): void {
    this.reportClientBusinessId = (event.target as HTMLSelectElement).value;
    this.loadClientBusinessReport();
  }

  loadClientBusinessReport(): void {
    this.isLoadingReport = true;
    this.reportError = '';
    this.api.getClientBusinessReport(this.reportClientBusinessId || undefined)
      .pipe(finalize(() => this.isLoadingReport = false))
      .subscribe({
        next: report => this.clientBusinessReport = report,
        error: error => {
          this.clientBusinessReport = undefined;
          this.reportError = this.getRequestError(error);
        }
      });
  }

  inviteClientUser(): void {
    if (!this.selectedClientBusinessId || this.invitationForm.invalid || this.isSavingInvitation) {
      this.invitationForm.markAllAsTouched();
      return;
    }

    const request = this.invitationForm.getRawValue();
    this.isSavingInvitation = true;
    this.invitationsError = '';
    this.invitationMessage = '';
    this.api.inviteClientBusinessUser(this.selectedClientBusinessId, {
      email: request.email.trim(),
      role: request.role
    }).pipe(finalize(() => this.isSavingInvitation = false)).subscribe({
      next: () => {
        this.invitationForm.reset({ email: '', role: 'Viewer' });
        this.invitationMessage = 'Invitation queued for delivery.';
        this.loadClientBusinessInvitations(this.selectedClientBusinessId);
      },
      error: error => this.invitationsError = this.getRequestError(error)
    });
  }

  revokeClientInvitation(invitation: ClientBusinessInvitation): void {
    if (!this.selectedClientBusinessId || this.isSavingInvitation
      || (invitation.status !== 'Pending' && invitation.status !== 'Accepted')
      || !window.confirm(`Revoke ${invitation.status === 'Accepted' ? 'client access for' : 'the invitation for'} ${invitation.email}?`)) {
      return;
    }

    this.isSavingInvitation = true;
    this.invitationsError = '';
    this.api.revokeClientBusinessInvitation(this.selectedClientBusinessId, invitation.id)
      .pipe(finalize(() => this.isSavingInvitation = false))
      .subscribe({
        next: () => this.loadClientBusinessInvitations(this.selectedClientBusinessId),
        error: error => this.invitationsError = this.getRequestError(error)
      });
  }

  private acceptInvitationFromUrl(): void {
    const url = new URL(window.location.href);
    const token = url.searchParams.get('clientInvite');
    if (!token) {
      return;
    }

    url.searchParams.delete('clientInvite');
    window.history.replaceState(window.history.state, document.title, `${url.pathname}${url.search}${url.hash}`);
    this.api.acceptClientBusinessInvitation(token).subscribe({
      next: invitation => {
        this.clientBusinessMessage = `Access to ${invitation.clientBusinessName} was granted as ${invitation.role}.`;
        this.loadClientBusinesses();
        this.loadWorkspaces();
      },
      error: error => this.clientBusinessesError = this.getRequestError(error)
    });
  }

  private loadClientBusinessLocations(clientBusinessId: string): void {
    const generation = ++this.locationLoadGeneration;
    this.locationError = '';
    if (!clientBusinessId) {
      this.locations = [];
      this.isLoadingLocations = false;
      this.prospectForm.controls.locationId.setValue('');
      return;
    }

    this.isLoadingLocations = true;
    this.api.listClientBusinessLocations(clientBusinessId)
      .pipe(finalize(() => {
        if (generation === this.locationLoadGeneration) {
          this.isLoadingLocations = false;
        }
      }))
      .subscribe({
        next: locations => {
          if (generation !== this.locationLoadGeneration) {
            return;
          }
          this.locations = locations;
          if (!locations.some(location =>
            location.id === this.prospectForm.controls.locationId.value && location.isActive)) {
            this.prospectForm.controls.locationId.setValue('');
          }
        },
        error: error => {
          if (generation === this.locationLoadGeneration) {
            this.locations = [];
            this.locationError = this.getRequestError(error);
          }
        }
      });
  }

  editLocation(location: ClientBusinessLocation): void {
    this.editingLocationId = location.id;
    this.locationMessage = '';
    this.locationForm.setValue({
      name: location.name,
      code: location.code ?? '',
      addressLine1: location.addressLine1,
      addressLine2: location.addressLine2 ?? '',
      city: location.city,
      region: location.region ?? '',
      postalCode: location.postalCode ?? '',
      countryCode: location.countryCode,
      timeZoneId: location.timeZoneId,
      operatingHours: location.operatingHours ?? ''
    });
  }

  cancelLocationEdit(): void {
    this.editingLocationId = '';
    this.locationForm.reset({
      name: '',
      code: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      region: '',
      postalCode: '',
      countryCode: this.clientBusinesses.find(business => business.id === this.selectedClientBusinessId)?.countryCode ?? 'US',
      timeZoneId: this.clientBusinesses.find(business => business.id === this.selectedClientBusinessId)?.defaultTimeZoneId ?? 'America/Los_Angeles',
      operatingHours: ''
    });
  }

  saveLocation(): void {
    if (!this.selectedClientBusinessId || this.locationForm.invalid || this.isSavingLocation) {
      this.locationForm.markAllAsTouched();
      return;
    }

    const form = this.locationForm.getRawValue();
    const request: ClientBusinessLocationRequest = {
      name: form.name.trim(),
      code: form.code.trim() || undefined,
      addressLine1: form.addressLine1.trim(),
      addressLine2: form.addressLine2.trim() || undefined,
      city: form.city.trim(),
      region: form.region.trim() || undefined,
      postalCode: form.postalCode.trim() || undefined,
      countryCode: form.countryCode.trim().toUpperCase(),
      timeZoneId: form.timeZoneId.trim(),
      operatingHours: form.operatingHours.trim() || undefined
    };
    const save = this.editingLocationId
      ? this.api.updateClientBusinessLocation(this.selectedClientBusinessId, this.editingLocationId, request)
      : this.api.createClientBusinessLocation(this.selectedClientBusinessId, request);

    this.isSavingLocation = true;
    this.locationError = '';
    this.locationMessage = '';
    save.pipe(finalize(() => this.isSavingLocation = false)).subscribe({
      next: () => {
        this.locationMessage = this.editingLocationId ? 'Location updated.' : 'Location created.';
        this.cancelLocationEdit();
        this.loadClientBusinessLocations(this.selectedClientBusinessId);
        this.loadBusinessConfig();
        this.loadLeads();
      },
      error: error => this.locationError = this.getRequestError(error)
    });
  }

  setLocationActive(location: ClientBusinessLocation, isActive: boolean): void {
    if (!this.selectedClientBusinessId || this.isSavingLocation) {
      return;
    }

    this.isSavingLocation = true;
    this.locationError = '';
    this.api.setClientBusinessLocationActive(this.selectedClientBusinessId, location.id, isActive)
      .pipe(finalize(() => this.isSavingLocation = false))
      .subscribe({
        next: () => {
          this.locationMessage = isActive ? 'Location activated.' : 'Location deactivated.';
          this.loadClientBusinessLocations(this.selectedClientBusinessId);
        this.loadBusinessConfig();
        this.loadLeads();
        },
        error: error => this.locationError = this.getRequestError(error)
      });
  }

  loadClientBusinessUsers(clientBusinessId: string): void {
    this.clientBusinessUsers = [];
    this.clientBusinessUsersError = '';
    if (!clientBusinessId || !this.organization?.canManage) {
      return;
    }

    this.isLoadingClientBusinessUsers = true;
    this.api.listClientBusinessUsers(clientBusinessId)
      .pipe(finalize(() => this.isLoadingClientBusinessUsers = false))
      .subscribe({
        next: (users) => this.clientBusinessUsers = users,
        error: (error) => this.clientBusinessUsersError = this.getRequestError(error)
      });
  }

  createClientBusiness(): void {
    if (this.clientBusinessForm.invalid || this.isSavingClientBusiness) {
      this.clientBusinessForm.markAllAsTouched();
      return;
    }

    this.isSavingClientBusiness = true;
    this.clientBusinessesError = '';
    this.clientBusinessMessage = '';
    this.api.createClientBusiness(this.clientBusinessForm.getRawValue())
      .pipe(finalize(() => this.isSavingClientBusiness = false))
      .subscribe({
        next: (business) => {
          this.clientBusinessForm.reset({
            name: '',
            slug: '',
            countryCode: 'US',
            defaultTimeZoneId: this.organization?.defaultTimeZoneId ?? 'America/Los_Angeles'
          });
          this.clientBusinessMessage = 'Client business created.';
          this.clientBusinesses = [...this.clientBusinesses, business].sort((a, b) => a.name.localeCompare(b.name));
          this.selectedClientBusinessId = business.id;
          this.loadClientBusinessUsers(business.id);
        },
        error: (error) => this.clientBusinessesError = this.getRequestError(error)
      });
  }

  assignClientBusinessUser(): void {
    if (this.clientBusinessUserForm.invalid || this.isSavingClientBusinessUser || !this.selectedClientBusinessId) {
      this.clientBusinessUserForm.markAllAsTouched();
      return;
    }

    const request = this.clientBusinessUserForm.getRawValue();
    this.isSavingClientBusinessUser = true;
    this.clientBusinessUsersError = '';
    this.api.assignClientBusinessUser(
      this.selectedClientBusinessId,
      request.userId.trim(),
      request.role)
      .pipe(finalize(() => this.isSavingClientBusinessUser = false))
      .subscribe({
        next: () => {
          this.clientBusinessUserForm.reset({ userId: '', role: 'Viewer' });
          this.loadClientBusinessUsers(this.selectedClientBusinessId);
        },
        error: (error) => this.clientBusinessUsersError = this.getRequestError(error)
      });
  }

  revokeClientBusinessUser(user: ClientBusinessUser): void {
    if (!this.selectedClientBusinessId || this.isSavingClientBusinessUser
      || !window.confirm(`Revoke ${user.role} access for ${user.userId}? Client data will be retained.`)) {
      return;
    }

    this.isSavingClientBusinessUser = true;
    this.clientBusinessUsersError = '';
    this.api.revokeClientBusinessUser(this.selectedClientBusinessId, user.userId)
      .pipe(finalize(() => this.isSavingClientBusinessUser = false))
      .subscribe({
        next: () => this.loadClientBusinessUsers(this.selectedClientBusinessId),
        error: (error) => this.clientBusinessUsersError = this.getRequestError(error)
      });
  }

  refreshConnection(): void {
    this.connectionState = 'checking';
    this.api.checkReadiness().subscribe({
      next: (status) => {
        this.connectionState = status.trim().toLowerCase() === 'healthy' ? 'connected' : 'unavailable';
        this.lastChecked = new Date();
      },
      error: () => {
        this.connectionState = 'unavailable';
        this.lastChecked = new Date();
      }
    });
  }

  loadProspects(): void {
    this.isLoadingProspects = true;
    this.prospectsError = '';
    this.api.listProspects().pipe(finalize(() => this.isLoadingProspects = false)).subscribe({
      next: (result) => {
        this.prospects = result.items;
        this.totalProspects = result.totalCount;
      },
      error: (error) => {
        this.prospectsError = this.getRequestError(error);
      }
    });
  }

  onProspectTypeChange(): void {
    if (this.prospectForm.controls.type.value === 'B2C') {
      this.prospectForm.patchValue({ website: '', industry: '' });
    }
  }

  createProspect(confirmPossibleDuplicates = false): void {
    if (!this.workspaceContext.current) {
      this.saveError = 'Select an assigned client workspace before adding a prospect.';
      return;
    }

    if (this.prospectForm.invalid || this.isSavingProspect) {
      this.prospectForm.markAllAsTouched();
      return;
    }

    const request = this.prospectForm.getRawValue();
    this.isSavingProspect = true;
    this.saveError = '';
    this.successMessage = '';
    this.duplicateWarning = '';
    this.api.createProspect({
      type: request.type,
      name: request.name.trim(),
      email: request.email?.trim() || undefined,
      phone: request.phone?.trim() || undefined,
      website: request.website?.trim() || undefined,
      industry: request.industry?.trim() || undefined,
      locationId: request.locationId?.trim() || undefined,
      confirmPossibleDuplicates
    }).pipe(finalize(() => this.isSavingProspect = false)).subscribe({
      next: () => {
        this.prospectForm.reset({ type: 'B2B', name: '', email: '', phone: '', website: '', industry: '', locationId: '' });
        this.duplicateMatches = [];
        this.successMessage = 'Prospect added to this workspace.';
        this.loadProspects();
      },
      error: (error) => {
        if (error instanceof HttpErrorResponse && error.status === 409 && this.isDuplicateConflict(error.error)) {
          this.duplicateMatches = error.error.matches;
          this.duplicateWarning = error.error.message;
          return;
        }
        this.saveError = this.getRequestError(error);
      }
    });
  }

  // ---------- EP-01/03/10/05/21 dashboard panels ----------
  orgMembers: OrgMember[] = [];
  permissions?: PermissionsResponse;
  isLoadingMembers = false;
  membersError = '';
  memberMessage = '';
  businessProfile?: BusinessProfile;
  offerings: Offering[] = [];
  targetIndustries: TargetIndustry[] = [];
  isLoadingBusinessConfig = false;
  businessConfigError = '';
  businessConfigMessage = '';
  leads: Lead[] = [];
  leadStages: LeadStage[] = [];
  isLoadingLeads = false;
  leadsError = '';
  leadMessage = '';
  discoveryJobs: DiscoveryJob[] = [];
  discoverySources: DiscoverySource[] = [];
  isLoadingDiscovery = false;
  discoveryError = '';
  discoveryMessage = '';
  candidateProfile?: CandidateProfile;
  candidatePrefs?: CandidatePreferences;
  isLoadingCandidate = false;
  candidateError = '';
  candidateMessage = '';
  readonly daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  readonly profileForm = this.formBuilder.nonNullable.group({
    description: ['', Validators.maxLength(2000)],
    industry: ['', Validators.maxLength(120)],
    category: ['', Validators.maxLength(120)]
  });
  readonly offeringForm = this.formBuilder.nonNullable.group({
    kind: this.formBuilder.nonNullable.control('Product'),
    name: ['', [Validators.required, Validators.maxLength(200)]],
    description: ['', Validators.maxLength(2000)]
  });
  readonly targetIndustryForm = this.formBuilder.nonNullable.group({
    industry: ['', [Validators.required, Validators.maxLength(120)]]
  });
  readonly leadForm = this.formBuilder.nonNullable.group({
    type: this.formBuilder.nonNullable.control('Organization'),
    name: ['', [Validators.required, Validators.maxLength(200)]],
    email: ['', Validators.email],
    phone: ['', Validators.maxLength(50)],
    industry: ['', Validators.maxLength(120)]
  });
  readonly discoveryJobForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(200)]],
    type: this.formBuilder.nonNullable.control('B2B'),
    geography: ['', Validators.maxLength(200)],
    keywords: ['', Validators.maxLength(500)]
  });
  readonly candidateProfileForm = this.formBuilder.nonNullable.group({
    displayName: ['', [Validators.required, Validators.maxLength(200)]],
    headline: ['', Validators.maxLength(300)],
    summary: ['', Validators.maxLength(4000)],
    location: ['', Validators.maxLength(200)],
    visibility: this.formBuilder.nonNullable.control('Private')
  });
  readonly candidatePrefsForm = this.formBuilder.nonNullable.group({
    targetRoles: ['', Validators.maxLength(2000)],
    industries: ['', Validators.maxLength(2000)],
    locations: ['', Validators.maxLength(2000)],
    workArrangement: ['', Validators.maxLength(50)],
    minCompensation: [null as number | null]
  });

  // ---------- loaders ----------
  loadOrgMembers(): void {
    this.isLoadingMembers = true;
    this.membersError = '';
    this.api.listOrganizationMembers().pipe(finalize(() => this.isLoadingMembers = false)).subscribe({
      next: (members) => this.orgMembers = members,
      error: (error: HttpErrorResponse) => this.membersError = this.getRequestError(error)
    });
    this.api.getPermissions().subscribe({ next: (p) => this.permissions = p, error: () => undefined });
  }

  loadBusinessConfig(): void {
    const cb = this.selectedClientBusinessId;
    if (!cb) { this.businessProfile = undefined; this.offerings = []; this.targetIndustries = []; return; }
    this.isLoadingBusinessConfig = true;
    this.businessConfigError = '';
    this.api.getBusinessProfile(cb).pipe(finalize(() => this.isLoadingBusinessConfig = false)).subscribe({
      next: (profile) => {
        this.businessProfile = profile;
        this.profileForm.patchValue({ description: profile.description ?? '', industry: profile.industry ?? '', category: profile.category ?? '' });
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 404) { this.businessProfile = undefined; this.profileForm.reset({ description: '', industry: '', category: '' }); }
        else this.businessConfigError = this.getRequestError(error);
      }
    });
    this.api.listOfferings(cb).subscribe({ next: (o) => this.offerings = o, error: () => undefined });
    this.api.listTargetIndustries(cb).subscribe({ next: (i) => this.targetIndustries = i, error: () => undefined });
  }

  saveBusinessProfile(): void {
    const cb = this.selectedClientBusinessId;
    if (!cb || this.profileForm.invalid) return;
    this.isSavingLocation = true;
    this.businessConfigMessage = '';
    this.api.updateBusinessProfile(cb, this.profileForm.getRawValue()).pipe(finalize(() => this.isSavingLocation = false)).subscribe({
      next: (profile) => { this.businessProfile = profile; this.businessConfigMessage = 'Business profile saved.'; },
      error: (error: HttpErrorResponse) => this.businessConfigError = this.getRequestError(error)
    });
  }

  addOffering(): void {
    const cb = this.selectedClientBusinessId;
    if (!cb || this.offeringForm.invalid) return;
    this.api.createOffering(cb, this.offeringForm.getRawValue()).subscribe({
      next: (o) => { this.offerings = [...this.offerings, o]; this.offeringForm.reset({ kind: 'Product', name: '', description: '' }); },
      error: (error: HttpErrorResponse) => this.businessConfigError = this.getRequestError(error)
    });
  }

  toggleOffering(offering: Offering): void {
    const cb = this.selectedClientBusinessId;
    if (!cb) return;
    this.api.setOfferingStatus(cb, offering.id, !offering.isActive).subscribe({
      next: (updated) => this.offerings = this.offerings.map(o => o.id === updated.id ? updated : o),
      error: (error: HttpErrorResponse) => this.businessConfigError = this.getRequestError(error)
    });
  }

  addTargetIndustry(): void {
    const cb = this.selectedClientBusinessId;
    if (!cb || this.targetIndustryForm.invalid) return;
    this.api.addTargetIndustry(cb, this.targetIndustryForm.getRawValue().industry).subscribe({
      next: (i) => { this.targetIndustries = [...this.targetIndustries, i]; this.targetIndustryForm.reset(); },
      error: (error: HttpErrorResponse) => this.businessConfigError = this.getRequestError(error)
    });
  }

  removeTargetIndustry(industry: TargetIndustry): void {
    const cb = this.selectedClientBusinessId;
    if (!cb) return;
    this.api.removeTargetIndustry(cb, industry.id).subscribe({
      next: () => this.targetIndustries = this.targetIndustries.filter(i => i.id !== industry.id),
      error: (error: HttpErrorResponse) => this.businessConfigError = this.getRequestError(error)
    });
  }

  loadLeads(): void {
    const cb = this.selectedClientBusinessId;
    if (!cb) { this.leads = []; this.leadStages = []; return; }
    this.isLoadingLeads = true;
    this.leadsError = '';
    this.api.listLeads(cb).pipe(finalize(() => this.isLoadingLeads = false)).subscribe({
      next: (items) => this.leads = items,
      error: (error: HttpErrorResponse) => this.leadsError = this.getRequestError(error)
    });
    this.api.listLeadStages(cb).subscribe({ next: (s) => this.leadStages = s, error: () => undefined });
  }

  createLead(): void {
    const cb = this.selectedClientBusinessId;
    if (!cb || this.leadForm.invalid) return;
    this.leadMessage = '';
    this.api.createLead(cb, { ...this.leadForm.getRawValue(), type: this.leadForm.getRawValue().type === 'Individual' ? 'Individual' : 'Organization' }).subscribe({
      next: (lead) => { this.leads = [lead, ...this.leads]; this.leadForm.reset({ type: 'Organization', name: '', email: '', phone: '', industry: '' }); this.leadMessage = 'Lead created.'; },
      error: (error: HttpErrorResponse) => this.leadsError = this.getRequestError(error)
    });
  }

  setLeadStage(lead: Lead, stageKey: string): void {
    const cb = this.selectedClientBusinessId;
    if (!cb || !stageKey) return;
    this.api.setLeadStage(cb, lead.id, stageKey).subscribe({
      next: (updated) => this.leads = this.leads.map(l => l.id === updated.id ? updated : l),
      error: (error: HttpErrorResponse) => this.leadsError = this.getRequestError(error)
    });
  }

  archiveLead(lead: Lead): void {
    const cb = this.selectedClientBusinessId;
    if (!cb) return;
    this.api.archiveLead(cb, lead.id).subscribe({
      next: (updated) => this.leads = this.leads.map(l => l.id === updated.id ? updated : l),
      error: (error: HttpErrorResponse) => this.leadsError = this.getRequestError(error)
    });
  }

  convertLead(lead: Lead): void {
    const cb = this.selectedClientBusinessId;
    if (!cb) return;
    this.api.convertLead(cb, lead.id).subscribe({
      next: (updated) => this.leads = this.leads.map(l => l.id === updated.id ? updated : l),
      error: (error: HttpErrorResponse) => this.leadsError = this.getRequestError(error)
    });
  }

  loadDiscovery(): void {
    this.isLoadingDiscovery = true;
    this.discoveryError = '';
    this.api.listDiscoverySources().pipe(finalize(() => this.isLoadingDiscovery = false)).subscribe({
      next: (sources) => this.discoverySources = sources,
      error: (error: HttpErrorResponse) => this.discoveryError = this.getRequestError(error)
    });
    const cb = this.selectedClientBusinessId || undefined;
    this.api.listDiscoveryJobs(cb).subscribe({ next: (jobs) => this.discoveryJobs = jobs, error: () => undefined });
  }

  createDiscoveryJob(): void {
    const cb = this.selectedClientBusinessId || undefined;
    if (this.discoveryJobForm.invalid) return;
    const v = this.discoveryJobForm.getRawValue();
    const keywords = v.keywords ? v.keywords.split(',').map(k => k.trim()).filter(k => k.length > 0) : undefined;
    this.api.createDiscoveryJob({
      name: v.name, type: v.type, clientBusinessId: cb, geography: v.geography || undefined, keywords
    }).subscribe({
      next: (job) => { this.discoveryJobs = [job, ...this.discoveryJobs]; this.discoveryJobForm.reset({ name: '', type: 'B2B', geography: '', keywords: '' }); this.discoveryMessage = 'Discovery job created.'; },
      error: (error: HttpErrorResponse) => this.discoveryError = this.getRequestError(error)
    });
  }

  executeDiscoveryJob(job: DiscoveryJob): void {
    this.api.executeDiscoveryJob(job.id).subscribe({
      next: (execution) => { this.discoveryMessage = `Execution ${execution.status}: ${execution.newResults} new, ${execution.duplicateResults} duplicates.`; this.loadDiscovery(); },
      error: (error: HttpErrorResponse) => this.discoveryError = this.getRequestError(error)
    });
  }

  loadCandidate(): void {
    this.isLoadingCandidate = true;
    this.candidateError = '';
    this.api.getCandidateProfile().pipe(finalize(() => this.isLoadingCandidate = false)).subscribe({
      next: (profile) => {
        this.candidateProfile = profile;
        this.candidateProfileForm.patchValue({
          displayName: profile.displayName, headline: profile.headline ?? '', summary: profile.summary ?? '',
          location: profile.location ?? '', visibility: profile.visibility
        });
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 404) this.candidateProfile = undefined;
        else this.candidateError = this.getRequestError(error);
      }
    });
    this.api.getCandidatePreferences().subscribe({
      next: (prefs) => {
        this.candidatePrefs = prefs;
        this.candidatePrefsForm.patchValue({
          targetRoles: prefs.targetRolesJson, industries: prefs.industriesJson, locations: prefs.locationsJson,
          workArrangement: prefs.workArrangement ?? '', minCompensation: prefs.minCompensation ?? null
        });
      },
      error: () => undefined
    });
  }

  saveCandidateProfile(): void {
    if (this.candidateProfileForm.invalid) return;
    const v = this.candidateProfileForm.getRawValue();
    this.api.upsertCandidateProfile(v).subscribe({
      next: (profile) => { this.candidateProfile = profile; this.candidateMessage = 'Candidate profile saved.'; },
      error: (error: HttpErrorResponse) => this.candidateError = this.getRequestError(error)
    });
  }

  saveCandidatePreferences(): void {
    const v = this.candidatePrefsForm.getRawValue();
    this.api.upsertCandidatePreferences({
      targetRolesJson: v.targetRoles ?? '', industriesJson: v.industries ?? '', locationsJson: v.locations ?? '',
      workArrangement: v.workArrangement || undefined, minCompensation: v.minCompensation ?? undefined
    }).subscribe({
      next: (prefs) => { this.candidatePrefs = prefs; this.candidateMessage = 'Job preferences saved.'; },
      error: (error: HttpErrorResponse) => this.candidateError = this.getRequestError(error)
    });
  }

  private isDuplicateConflict(value: unknown): value is ProspectDuplicateConflict {
    if (typeof value !== 'object' || value === null) {
      return false;
    }

    const response = value as { message?: unknown; matches?: unknown };
    return typeof response.message === 'string' && Array.isArray(response.matches);
  }

  private getRequestError(error: HttpErrorResponse): string {
    if (error.status === 401) {
      return 'Your session is not authenticated. Sign in and try again.';
    }
    const detail = error.error?.detail;
    if (typeof detail === 'string') {
      return detail;
    }
    if (error.status === 403) {
      return 'Your token is missing a valid organization, branch, or user ID claim.';
    }
    if (error.status === 0) {
      return 'The Lead Gen API is unavailable. Check the API connection and try again.';
    }
    if (error.status === 400 && typeof error.error === 'object' && error.error !== null) {
      const body = error.error as { errors?: Record<string, string[]> };
      const messages = Object.values(body.errors ?? {}).flat();
      if (messages.length > 0) {
        return messages.join(' ');
      }
    }
    return 'The request could not be completed. Review the fields and try again.';
  }
}