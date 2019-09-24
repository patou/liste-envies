import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from "@angular/core";

@Component({
  selector: "app-img-form",
  templateUrl: "./img-form.component.html",
  styleUrls: ["./img-form.component.scss"]
})
export class ImgFormComponent implements OnInit {
  @Input()
  public imgs: string[];

  public newImages: string[];

  @Output()
  public onChange = new EventEmitter<string[]>();

  public addImage = "";

  @ViewChild("myPond", {static: false}) myPond: any;

  pondOptions = {
    class: "my-filepond",
    multiple: true,
    acceptedFileTypes: "image/*",
    imageResizeTargetWidth: 400,
    imageCropAspectRatio: 1,
    imageTransformOutputMimeType: "image/jpeg",
    imageTransformOutputQuality: 50,
    allowFileEncode: true,
    labelIdle:
      'Glisser-déposer vos images ou <span class="filepond--label-action"> Parcourir votre ordinateur </span>',
    labelFileTypeNotAllowed: "Fichiers non authorisé",
    fileValidateTypeLabelExpectedTypes: "Seuls les images sont authorisés"
  };

  pondFiles = [];

  constructor() {}

  ngOnInit() {
    this.newImages = this.imgs ? this.imgs.slice(0) : [];
  }

  public addImg(name: string) {
    if (this.newImages) {
      this.newImages.push(name);
    } else {
      this.newImages = [name];
    }

    this.emitChange();
    this.addImage = "";
  }

  private emitChange() {
    this.onChange.emit(this.newImages);
  }

  public removeImg(index: number) {
    this.newImages.splice(index, 1);
    this.emitChange();
  }


  pondHandleAddFile(event: any) {
    console.log('pound Handle add file', event);

    this.addImg(event.file.getFileEncodeDataURL());
    if (!event.error && !event.status) {
      this.myPond.removeFile(event.file.id);
    }


  }
}
