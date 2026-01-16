export class Guid {
  static newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

/**
 * Represents an UploadQueue
 */
export class SupportUploadQueue {
  id: string;
  file: File;
  progress: number;
  message: string;
  isReady:boolean;
  isUploading:boolean;
  isCancel: boolean;
  isError: boolean;
  get isSuccess(): boolean {
    if (this.progress == 100)
      return true;

    return false;
  };

  constructor(file: File) {
    this.file = file;
    this.progress = 0;
    this.id = Guid.newGuid();
    this.message = '';
    this.isReady = false;
    this.isUploading = false;
    this.isCancel = false;
    this.isError = false;
  }

  cancel(){
    this.isCancel = true;
    this.isUploading = false;
  }
}

export class SupportUploader {
  queue: SupportUploadQueue[];

  constructor() {
    this.queue = [];
  }
}
