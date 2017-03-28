import { Component, OnInit, ElementRef, Input, Renderer, ViewChild} from '@angular/core';
import { ToggleContainerComponent } from '../../core/toggle-container/toggle-container.component';

@Component({
  selector: 'sm-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss']
})
export class TooltipComponent extends ToggleContainerComponent implements OnInit {

  @Input() css:string;

  // SmPositionDirective params
  @Input() position:string|undefined = undefined;
  @Input() positionLuncher:HTMLElement|undefined = undefined;
  @Input() positionPreventAdjust:boolean = false;
  @Input() onHover:boolean = false;

  constructor(
    protected currentComponent:ElementRef,
    protected renderer:Renderer
  ) {
    super(currentComponent, renderer)
  }

  ngOnInit() {
    if (this.onHover) {
      this.handleOnHoverToggle();
    }
  }

  private get getAdditionalCssClasses():string {
    return this.preventCloseContentClick ? this.cssPreventContentClickClose : '';
  }

  private get getMinWidth():string {
    return this.minWidthForTooltip;

    //return this.minWidthForTooltip && 'min-width:'+ this.minWidthForTooltip;
  }

  public open($ev?):void {
    this.openToggleContainer($ev);
  }

  public close($ev?):void {
    this.closeToggleContainer($ev);
  }

  public handleOnHoverToggle():void {
    if(this.luncher instanceof HTMLElement) {
      this.luncher.addEventListener('mouseover', (ev) => {
        this.openToggleContainer(ev);
      }, false);

      this.luncher.addEventListener('mouseout', (ev) => {
        this.closeToggleContainer(ev);
      }, false);
    }
  }

}
