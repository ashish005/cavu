/** Studio entity domain model — mirrors backend StudioEntity. */
export class StudioEntityModel {
  id: string;
  name: string;
  classification: string;
  score: number;
  stage: string;
  source: string;
  evidenceJson: string;
  contactJson?: string;
  createdAt: string;

  constructor(model: any = {}) {
    const { id, name, classification, score, stage, source, evidenceJson, contactJson, createdAt } = model ?? {};
    this.id = id; this.name = name; this.classification = classification;
    this.score = score; this.stage = stage; this.source = source;
    this.evidenceJson = evidenceJson; this.contactJson = contactJson; this.createdAt = createdAt;
  }

  get contact(): { name?: string; role?: string; email?: string } | null {
    try { return this.contactJson ? JSON.parse(this.contactJson) : null; } catch { return null; }
  }
  get evidence(): { label: string; source: string; verified: boolean }[] {
    try { return JSON.parse(this.evidenceJson || '[]'); } catch { return []; }
  }
  toRequest() {
    return {
      name: this.name, classification: this.classification, score: this.score,
      stage: this.stage, source: this.source, evidenceJson: this.evidenceJson, contactJson: this.contactJson,
    };
  }
}

export interface StudioEntityQueryOptions {
  classification?: string;
  page: number;
  pageSize: number;
}
