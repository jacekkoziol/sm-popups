import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayComponent } from './core/overlay/overlay.component';

import { SmToOverlayDirective } from './directives/sm-to-overlay.directive';
import { ToggleContainerComponent } from './core/toggle-container/toggle-container.component';
import { SmPositionDirective } from './directives/sm-position.directive';

//import './core/_core.scss';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    OverlayComponent,
    SmToOverlayDirective,
    ToggleContainerComponent,
    SmPositionDirective
  ],
  exports: [
    OverlayComponent,
    ToggleContainerComponent,
    SmToOverlayDirective,
    SmPositionDirective
  ],
  providers: []
})
export class SmPopupsModule { }
