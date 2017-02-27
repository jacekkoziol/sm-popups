import { Directive, OnInit, ElementRef } from '@angular/core';

const OVERLAY_CSS_CLASS = 'sm-overlay-container';
const OVERLAY_CONTAINER_ID = 'smOverlayMainContainerId';
let overlayContainer = null;

@Directive({
  selector: '[smToOverlay]'
})
export class SmToOverlayDirective {

  constructor(
    private el?:ElementRef,
  ) { }

  ngOnInit() {
    this.initOverlayContainer();
    this.moveToOverlay();
  }

  private initOverlayContainer():void {
    //if (!overlayContainer) {
    if (!this.checkIfContainerExists()) {
      this.generateOverlayContainer();
    }
  }

  private generateOverlayContainer() {
    let container = document.createElement('div');
    container.className = OVERLAY_CSS_CLASS;
    container.id = OVERLAY_CONTAINER_ID;
    overlayContainer = container;
    document.body.appendChild(container);
  }

  private moveToOverlay():void {
    if (overlayContainer) {
      overlayContainer.appendChild(this.el.nativeElement);
    }
  }

  private checkIfContainerExists():boolean {
    return !!document.getElementById(OVERLAY_CONTAINER_ID);
  }

}
