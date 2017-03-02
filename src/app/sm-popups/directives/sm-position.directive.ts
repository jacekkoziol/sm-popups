import { Directive, OnInit, OnDestroy, Input, ElementRef, Renderer, HostListener} from '@angular/core';

interface intentionalPositionI {
  top: number;
  left: number;
}

const POSITION_ADJUST_MARGIN = 10; //in pixels

@Directive({
  selector: '[smPosition]'
})
export class SmPositionDirective {


  /**
   *  @description: Set position of the element relatively to the target element
   *  (undefined) - to the bottom left of the target
   */
  @Input() smPosition:string|undefined = undefined;

  /**
   * @description The element to which we should use the relative position
   */
  @Input() smPositionLuncher:HTMLElement|undefined = undefined;

  /**
   * @description Prevent to adjust position
   */
  @Input() smPositionPreventAdjust:boolean = false;

  /**
   * @description Adjust position on resize
   */
  @HostListener('window:resize', ['$event'])
  private onWindowResize($ev) {
    //console.log('resized');
    this.resizeAdjustPositionHandler();
  }

  private targetElPosition:ClientRect;
  private intentionalPosition: intentionalPositionI = {top:0, left:0};

  constructor(
    private currentElement?:ElementRef,
    private renderer?:Renderer
  ) { }

  ngOnInit() {
    this.proccessPositioning();
  }

  private proccessPositioning():void {
    if (this.smPositionLuncher) {
      this.getTargetPosition();
      this.handlePositioningForCurrentEl();

      if (this.smPositionPreventAdjust) {
        return;
      }

      this.adjustPosition();
    }
  }

  private getTargetPosition():void {
    if (this.smPositionLuncher) {
      this.targetElPosition = this.smPositionLuncher.getBoundingClientRect();
    }
  }

  private handlePositioningForCurrentEl():void {
    switch (this.smPosition) {
      default:
        this.calcDefaultPosition();
    }

    this.setPositionForCurrentElement();
  }

  private calcDefaultPosition(): void {
    this.intentionalPosition.top = this.targetElPosition.top + this.targetElPosition.height;
    this.intentionalPosition.left = this.targetElPosition.left;
  }

  private calcTopPosition(): void {
    let tmpCurrElPos:ClientRect = this.currentElement.nativeElement.getBoundingClientRect();
    this.intentionalPosition.top = this.targetElPosition.top - tmpCurrElPos.height;
    this.intentionalPosition.left = this.targetElPosition.left;
  }

  private setPositionForCurrentElement():void {
    this.renderer.setElementStyle(this.currentElement.nativeElement, 'position', 'absolute');
    this.renderer.setElementStyle(this.currentElement.nativeElement, 'top', this.intentionalPosition.top + 'px');
    this.renderer.setElementStyle(this.currentElement.nativeElement, 'left', this.intentionalPosition.left + 'px');
  }

  private adjustPosition():void {
    let tmpCurrElPos:ClientRect = this.currentElement.nativeElement.getBoundingClientRect();
    let viewport = {width: window.innerWidth, height: window.innerHeight};
    let currentElRight = viewport.width - tmpCurrElPos.right;
    let currentElBottom = viewport.height - tmpCurrElPos.bottom;

    const POSITION_MAX_OVERSET = 10;

    // Right position
    if (currentElRight < POSITION_MAX_OVERSET && tmpCurrElPos.left >= POSITION_MAX_OVERSET) {
      this.intentionalPosition.left = this.intentionalPosition.left - (Math.abs(currentElRight) + POSITION_ADJUST_MARGIN);
    }

    // Bottom
    if (currentElBottom < POSITION_MAX_OVERSET && tmpCurrElPos.top >= POSITION_MAX_OVERSET) {
      this.intentionalPosition.top = this.intentionalPosition.top - (Math.abs(currentElBottom) + POSITION_ADJUST_MARGIN);
    }

    // Top position
    if (tmpCurrElPos.top < POSITION_MAX_OVERSET) {
      this.intentionalPosition.top = this.targetElPosition.top + Math.abs(this.targetElPosition.top) + POSITION_ADJUST_MARGIN;
    }

    if (this.intentionalPosition.top < POSITION_MAX_OVERSET) {
      this.intentionalPosition.top = POSITION_MAX_OVERSET;
    }

    // Left position
    if (tmpCurrElPos.left < POSITION_MAX_OVERSET) {
      this.intentionalPosition.left = this.targetElPosition.left + Math.abs(this.targetElPosition.left) + POSITION_ADJUST_MARGIN;
    }

    if (this.intentionalPosition.left < POSITION_MAX_OVERSET) {
      this.intentionalPosition.left = this.targetElPosition.left;//POSITION_MAX_OVERSET;
    }

    this.setPositionForCurrentElement();
  }

  private resizeAdjustPositionHandler():void {
    this.proccessPositioning();
  }

}
