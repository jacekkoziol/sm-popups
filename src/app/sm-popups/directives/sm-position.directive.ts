import { Directive, OnInit, OnDestroy, Input, ElementRef, Renderer} from '@angular/core';

interface intentionalPositionI {
  top: number;
  left: number;
}

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

    // Right position
    if (currentElRight < 0 && tmpCurrElPos.left >= 0) {
      this.intentionalPosition.left = this.intentionalPosition.left - Math.abs(currentElRight);
    }

    // Bottom
    if (currentElBottom < 0 && tmpCurrElPos.top >=0) {
      this.intentionalPosition.top = this.intentionalPosition.top - Math.abs(currentElBottom);
    }

    // Top position
    if (tmpCurrElPos.top < 0) {
      this.intentionalPosition.top = this.targetElPosition.top + Math.abs(this.targetElPosition.top);
    }

    // Left position
    if (tmpCurrElPos.left < 0) {
      this.intentionalPosition.left = this.targetElPosition.left + Math.abs(this.targetElPosition.left);
    }

    this.setPositionForCurrentElement();
  }

}
