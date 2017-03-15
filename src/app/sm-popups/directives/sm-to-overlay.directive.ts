import { Directive, OnInit, ElementRef, Input } from '@angular/core';

const OVERLAY_CSS_CLASS = 'sm-overlay-container';
const OVERLAY_CONTAINER_ID = 'smOverlayMainContainerId';
let overlayContainer = null;

@Directive({
  selector: '[smToOverlay]'
})
export class SmToOverlayDirective {
  private parentContainer:HTMLElement;
  private allowRemoveOnDestroy:boolean = true;

  @Input('smToOverlay') private removeOnDestroy;

  constructor(
    private el?:ElementRef,
  ) { }

  ngOnInit() {
    this.allowRemoveOnDestroy = (this.removeOnDestroy == false) ? false : true;

    this.updateDefaultOrigin();
    this.initOverlayContainer();
    this.moveToOverlay();
  }

  ngOnDestroy() {
    if (!this.allowRemoveOnDestroy != false) {
      this.removeCurrentNode();
    }
  }

  private initOverlayContainer():void {
    if (!this.checkIfContainerExists()) {
      this.generateOverlayContainer();
    }
  }

  private updateDefaultOrigin() {
    this.parentContainer = this.el.nativeElement.parentElement;
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

  private removeCurrentNode():void {
    if (this.el.nativeElement && this.el.nativeElement.parentNode) {
      this.el.nativeElement.parentNode.removeChild(this.el.nativeElement);
    }
  }

}
