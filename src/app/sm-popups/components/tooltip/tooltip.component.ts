import { Component, OnInit, ElementRef, Input} from '@angular/core';
import { ToggleContainerComponent } from '../../core/toggle-container/toggle-container.component';

@Component({
  selector: 'sm-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss']
})
export class TooltipComponent extends ToggleContainerComponent implements OnInit {

  // SmPositionDirective params
  @Input() position:string|undefined = undefined;
  @Input() positionLuncher:HTMLElement|undefined = undefined;
  @Input() positionPreventAdjust:boolean = false;

  constructor(
    protected currentComponent:ElementRef
  ) {
    super(currentComponent)
  }

  ngOnInit() {
  }

}
