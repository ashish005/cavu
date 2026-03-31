import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  Directive,
  TemplateRef
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {SupportUploader, SupportUploadQueue} from "../domain/support-uploader";
import {HttpEventType} from "@angular/common/http";
import {FeedbackSupportService} from "../services";
import html2canvas from 'html2canvas';

@Directive()
class SupportFileUploaderComponent {
  @ViewChild('fileControl', {static: true}) fileControl: ElementRef;
  public uploader: SupportUploader = new SupportUploader();
  public message: string;

  onFilesChange(fileList: any) {
    for (let file of fileList) {
      this.uploader.queue.push(new SupportUploadQueue(file));
    }
  }

  showUploader(){
    this.fileControl.nativeElement.click();
  }

  onFileInvalids(fileList: any) {
    //TODO handle invalid files here
  }

  onSelectChange(event: Event) {
    let eventObj: any = <any>event;
    let target: HTMLInputElement = <HTMLInputElement>eventObj.target;
    let files: FileList = target.files;

    if(files && files.length>0) {
      for(let i=0; i<files.length; i++){
        let file = files[i];
        this.uploader.queue.push(new SupportUploadQueue(file));
        console.log('Total Count:' + this.uploader.queue.length);
      }
    }
  }

  //getter : get overall progress
  get progress(): number {
    let psum = 0;
    if(!this.uploader){
      return 0;
    }
    for (let entry of this.uploader.queue) {
      psum += entry.progress;
    }

    if (psum == 0)
      return 0;

    return Math.round(psum / this.uploader.queue.length);
  };
}

@Component({
  selector: 'support', standalone: false,
  templateUrl:'./templates/support.html',
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
    .support-modal {
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }
    .support-header {
      background: linear-gradient(135deg, var(--company-primary) 0%, var(--company-secondary) 100%);
      color: white;
      padding: 2rem;
      border-radius: 12px 12px 0 0;
      text-align: center;
    }
    .support-section {
      padding: 2rem;
    }
    .form-section {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      border: 1px solid #e9ecef;
    }
    .screenshot-preview {
      position: relative;
      background: #f8f9fa;
      border-radius: 8px;
      padding: 1rem;
      min-height: 300px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .edit-toolbar {
      background: white;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      padding: 1rem;
      margin-bottom: 1rem;
    }
    .file-upload-area {
      border: 2px dashed var(--company-primary);
      border-radius: 8px;
      padding: 2rem;
      text-align: center;
      background: #f8f9fa;
      transition: all 0.3s ease;
    }
    .file-upload-area:hover {
      background: white;
      border-color: var(--company-accent);
    }
    .uploaded-files {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-top: 1rem;
    }
    .uploaded-file {
      position: relative;
      width: 100px;
      height: 100px;
      border-radius: 8px;
      overflow: hidden;
      background: white;
      border: 1px solid #e9ecef;
    }
  `], 
  providers: [FeedbackSupportService]
})
export class SupportComponent extends SupportFileUploaderComponent implements OnInit {
  @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
  @ViewChild('webPageImagePreview', { static: true }) webPageImagePreview: ElementRef;
  @ViewChild('canvasEditor', { static: false }) canvasEditor!: ElementRef;
  @ViewChild('additionalFileInput', { static: false }) additionalFileInput!: ElementRef;
  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();

  customForm: FormGroup;
  submitted: boolean = false;
  loadingText: string = 'Creating';
  supportTicketId: number;
  @Input() supportType: string;
  get actionType (){ return (this.supportTicketId) ? 'UPDATE': 'ADD'; };
  get isLoading() { return this.service.isLoading; };

  // Screenshot editing properties
  isEditMode: boolean = false;
  editMode: string = 'blur'; // 'blur' or 'paint'
  isDrawing: boolean = false;
  canvasContext: CanvasRenderingContext2D | null = null;
  originalCanvas: HTMLCanvasElement | null = null;
  
  // Zoom properties
  zoomLevel: number = 1;
  minZoom: number = 0.5;
  maxZoom: number = 3;
  zoomStep: number = 0.25;
  panX: number = 0;
  panY: number = 0;
  isPanning: boolean = false;
  lastPanPoint: { x: number; y: number } | null = null;

  // Additional images
  additionalImages: string[] = [];

  public captureScreen(){
    const modalBackdrop = document.querySelector('.modal-backdrop.show') as HTMLElement | null;
    if (modalBackdrop) {
      modalBackdrop.setAttribute('data-html2canvas-ignore', "true");
    }
    const modalAside = document.querySelector('.modal-open-aside.show') as HTMLElement | null;
    if (modalAside) {
      modalAside.setAttribute('data-html2canvas-ignore', "true");
    }
    return html2canvas(document.body);
  }

  constructor(public fb: FormBuilder, public router: Router, public service: FeedbackSupportService){
    super();
    this.customForm = this.fb.group({
      /*userTypeId: [{value:null, disabled: true }],*/
      userId: [{value:null, disabled: true }],
      supportTypeId: [null, Validators.required],
      mediaTypeId: [null],
      header: [null, Validators.required],
      message: [null, Validators.required],
      /*mobileNo: [null],
      emailId: [null],*/
      file: [null],
      includeScreenshot: [true],
      ip: [{value:null, disabled: true }],
      pageURL: [{value:null }]
    });
  }

  captureImageAndShow = (canvas: HTMLCanvasElement | null) => {
    if (!canvas) {
      return;
    }
    // Store original canvas
    this.originalCanvas = canvas;
    
    // Show the screenshot
    var base64image = canvas.toDataURL("image/png");
    this.webPageImagePreview.nativeElement.setAttribute('src', base64image);
    this.customForm.get('file').setValue(base64image);
  };

  // Screenshot editing methods
  enableEditMode() {
    if (!this.originalCanvas) return;
    
    this.isEditMode = true;
    this.zoomLevel = 1;
    this.panX = 0;
    this.panY = 0;
    
    // Wait for canvas to be rendered
    setTimeout(() => {
      this.setupCanvas();
    }, 100);
  }

  setupCanvas() {
    const canvas = this.canvasEditor?.nativeElement as HTMLCanvasElement;
    if (canvas && this.originalCanvas) {
      canvas.width = this.originalCanvas.width;
      canvas.height = this.originalCanvas.height;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        this.canvasContext = ctx;
        this.redrawCanvas();
      }
    }
  }

  redrawCanvas() {
    if (!this.canvasContext || !this.originalCanvas) return;
    
    const canvas = this.canvasEditor.nativeElement as HTMLCanvasElement;
    
    // Clear canvas
    this.canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    
    // Save context state
    this.canvasContext.save();
    
    // Apply zoom and pan transformations
    this.canvasContext.translate(this.panX, this.panY);
    this.canvasContext.scale(this.zoomLevel, this.zoomLevel);
    
    // Draw original image
    this.canvasContext.drawImage(this.originalCanvas, 0, 0);
    
    // Restore context state
    this.canvasContext.restore();
  }

  // Zoom methods
  zoomIn() {
    if (this.zoomLevel < this.maxZoom) {
      this.zoomLevel = Math.min(this.zoomLevel + this.zoomStep, this.maxZoom);
      this.redrawCanvas();
    }
  }

  zoomOut() {
    if (this.zoomLevel > this.minZoom) {
      this.zoomLevel = Math.max(this.zoomLevel - this.zoomStep, this.minZoom);
      this.redrawCanvas();
    }
  }

  resetZoom() {
    this.zoomLevel = 1;
    this.panX = 0;
    this.panY = 0;
    this.redrawCanvas();
  }

  // Pan methods
  startPan(event: MouseEvent) {
    if (event.shiftKey || event.button === 1) { // Shift+drag or middle mouse button
      this.isPanning = true;
      this.lastPanPoint = { x: event.clientX, y: event.clientY };
      event.preventDefault();
    }
  }

  pan(event: MouseEvent) {
    if (!this.isPanning || !this.lastPanPoint) return;
    
    const deltaX = event.clientX - this.lastPanPoint.x;
    const deltaY = event.clientY - this.lastPanPoint.y;
    
    this.panX += deltaX;
    this.panY += deltaY;
    
    this.lastPanPoint = { x: event.clientX, y: event.clientY };
    this.redrawCanvas();
  }

  stopPan() {
    this.isPanning = false;
    this.lastPanPoint = null;
  }

  // Drawing methods
  startDrawing(event: MouseEvent) {
    if (!this.isEditMode || !this.canvasContext || this.isPanning) return;
    
    this.isDrawing = true;
    const coords = this.getCanvasCoordinates(event);
    
    // Apply transformations for drawing
    this.canvasContext.save();
    this.canvasContext.translate(this.panX, this.panY);
    this.canvasContext.scale(this.zoomLevel, this.zoomLevel);
    
    this.canvasContext.beginPath();
    this.canvasContext.moveTo(coords.x, coords.y);
    
    // Set up drawing styles with scaled brush size
    this.canvasContext.globalCompositeOperation = 'source-over';
    this.canvasContext.lineWidth = 20 / this.zoomLevel; // Scale brush size with zoom
    this.canvasContext.lineCap = 'round';
    this.canvasContext.lineJoin = 'round';
    
    if (this.editMode === 'blur') {
      this.canvasContext.filter = 'blur(15px)';
      this.canvasContext.globalAlpha = 0.8;
      this.canvasContext.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    } else if (this.editMode === 'paint') {
      this.canvasContext.filter = 'none';
      this.canvasContext.globalAlpha = 1;
      this.canvasContext.strokeStyle = '#000000';
    }
  }

  draw(event: MouseEvent) {
    if (!this.isDrawing || !this.canvasContext || this.isPanning) return;
    
    const coords = this.getCanvasCoordinates(event);
    
    this.canvasContext.lineTo(coords.x, coords.y);
    this.canvasContext.stroke();
  }

  stopDrawing() {
    if (this.isDrawing && this.canvasContext) {
      this.canvasContext.restore(); // Restore from drawing transformations
      this.isDrawing = false;
      
      // Save current state to original canvas for persistence
      this.saveDrawingToOriginal();
    }
  }

  saveDrawingToOriginal() {
    if (!this.canvasContext || !this.originalCanvas) return;
    
    const canvas = this.canvasEditor.nativeElement as HTMLCanvasElement;
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    
    if (tempCtx) {
      // Copy current canvas state to temp canvas
      tempCtx.drawImage(canvas, 0, 0);
      
      // Update original canvas with edited version
      const newOriginalCanvas = document.createElement('canvas');
      newOriginalCanvas.width = this.originalCanvas.width;
      newOriginalCanvas.height = this.originalCanvas.height;
      const newOriginalCtx = newOriginalCanvas.getContext('2d');
      
      if (newOriginalCtx) {
        newOriginalCtx.drawImage(tempCanvas, 0, 0);
        this.originalCanvas = newOriginalCanvas;
      }
    }
  }

  // Convert screen coordinates to canvas coordinates
  getCanvasCoordinates(event: MouseEvent): { x: number; y: number } {
    const canvas = this.canvasEditor.nativeElement as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    
    const screenX = event.clientX - rect.left;
    const screenY = event.clientY - rect.top;
    
    const canvasX = (screenX - this.panX) / this.zoomLevel;
    const canvasY = (screenY - this.panY) / this.zoomLevel;
    
    return { x: canvasX, y: canvasY };
  }

  // Additional images handling
  onAdditionalImagesSelect(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.additionalImages.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removeAdditionalImage(index: number) {
    this.additionalImages.splice(index, 1);
  }

  disableEditMode() {
    this.isEditMode = false;
    this.saveEditedImage();
  }

  saveEditedImage() {
    const canvas = this.canvasEditor?.nativeElement as HTMLCanvasElement;
    if (canvas && this.canvasContext) {
      const base64image = canvas.toDataURL("image/png");
      this.webPageImagePreview.nativeElement.setAttribute('src', base64image);
      this.customForm.get('file').setValue(base64image);
    }
  }

  resetToOriginal() {
    if (!this.originalCanvas) return;
    
    // Reset zoom and pan
    this.zoomLevel = 1;
    this.panX = 0;
    this.panY = 0;
    
    const base64image = this.originalCanvas.toDataURL("image/png");
    this.webPageImagePreview.nativeElement.setAttribute('src', base64image);
    this.customForm.get('file').setValue(base64image);
    
    // Reset canvas if in edit mode
    if (this.isEditMode && this.canvasContext) {
      this.redrawCanvas();
    }
  }

  get f() { return this.customForm.controls; }

  ngOnInit(){
    this.captureScreen().then(this.captureImageAndShow);
    this.service.getSupportLookup().then(r => {
      const mediaType: any = this.service.masterType?.getInboxMediaType();
      this.customForm.get('mediaTypeId').setValue(mediaType?.id);
      if(this.supportType)
      {
        const supportType = this.service.masterType?.getSupportTypeByMasterType(this.supportType);
        this.customForm.get('supportTypeId').setValue(supportType?.id);
      }

    });
    this.customForm.get('pageURL').setValue(window.location.href);
  }

  onSubmit(form){
    if(this.customForm.invalid){
      return;
    }

    this.submitted = true;

    const success = (resp)=> {
      this.submitted = true;
      this.supportTicketId = resp.id;
      this.onOk.emit(true);
      this.uploadAll();
    };

    const failure = ()=> {
      this.submitted = true;
    };

    const data = this.customForm.getRawValue();
    const supportTicket = this.service.saveSupportTicket(data).toPromise();
    supportTicket.then(success, failure);
  }

  upload(_uploaderFile: SupportUploadQueue) {
    if (_uploaderFile == null)
      return;

    let selectedFile = this.uploader.queue.find(s => s.id == _uploaderFile.id);
    if (selectedFile) {
      this.uploadFile(selectedFile);
    }
  }
  //upload all selected files to server
  uploadAll() {
    //find the remaning files to upload
    let remainingFiles = this.uploader.queue.filter(s => !s.isSuccess);
    for (let item of remainingFiles) {
      this.upload(item);
    }
  }

  uploadFile = (selectedFile) => {
    const file = <File>selectedFile.file;

    if(!(file && this.supportTicketId)){
      return;
    }

    this.service.supportTicketUploadImages(this.supportTicketId, file).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress)
        selectedFile.progress = Math.round(100 * event.loaded / event.total);
      else if (event.type === HttpEventType.Response) {
        selectedFile.message = event.body.toString();
      }
    });
  }
}