import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AiStudioService, StudioEntity, PagedResult } from '../../ai-studio.service';
import { StudioEntityModel, StudioEntityQueryOptions } from '../domains/studio-entity.domain';

/** Resource-style service for StudioEntity — same shape as app entity services. */
@Injectable({ providedIn: 'root' })
export class StudioEntityService {
  private studio = inject(AiStudioService);

  list(options: StudioEntityQueryOptions): Observable<PagedResult<StudioEntityModel>> {
    return this.studio.listEntitiesPaged(options.classification, options.page, options.pageSize)
      .pipe(map(p => ({ ...p, items: p.items.map(i => new StudioEntityModel(i)) })));
  }
  get(id: string): Observable<StudioEntityModel> {
    return this.studio.listEntities().pipe(map(items => new StudioEntityModel(items.find(i => i.id === id))));
  }
  save(model: StudioEntityModel): Observable<StudioEntityModel> {
    const req = model.toRequest();
    return model.id
      ? this.studio.updateEntity(model.id, { ...req, id: model.id } as StudioEntity).pipe(map(r => new StudioEntityModel(r)))
      : this.studio.createEntity(req as any).pipe(map(r => new StudioEntityModel(r)));
  }
  remove(id: string): Observable<void> { return this.studio.moveStage(id, 'Deleted'); }
  moveStage(id: string, stage: string): Observable<void> { return this.studio.moveStage(id, stage); }
}
