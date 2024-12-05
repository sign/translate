import {Directive, HostListener, output} from '@angular/core';

@Directive({
  selector: '[appDropzone]',
})
export class DropzoneDirective {
  readonly dropped = output<FileList>();
  readonly hovered = output<boolean>();

  @HostListener('drop', ['$event'])
  onDrop($event: DragEvent) {
    $event.preventDefault();
    this.dropped.emit($event.dataTransfer?.files);
    this.hovered.emit(false);
  }

  @HostListener('dragover', ['$event'])
  onDragOver($event: Event) {
    $event.preventDefault();
    this.hovered.emit(true);
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave($event: Event) {
    $event.preventDefault();
    this.hovered.emit(false);
  }
}
