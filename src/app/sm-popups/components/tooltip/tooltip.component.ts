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

  constructor(
    protected currentComponent:ElementRef,
    protected renderer:Renderer
  ) {
    super(currentComponent, renderer)
  }

  ngOnInit() {
  }

  private get getMinWidth():string {
    return this.minWidthForTooltip;

    //return this.minWidthForTooltip && 'min-width:'+ this.minWidthForTooltip;
  }

}
