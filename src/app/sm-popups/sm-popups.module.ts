import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayComponent } from './core/overlay/overlay.component';

import { SmToOverlayDirective } from './directives/sm-to-overlay.directive';
import { ToggleContainerComponent } from './core/toggle-container/toggle-container.component';

//import './core/_core.scss';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    OverlayComponent,
    SmToOverlayDirective,
    ToggleContainerComponent
  ],
  exports: [
    OverlayComponent,
    SmToOverlayDirective,
    ToggleContainerComponent
  ],
  providers: []
})
export class SmPopupsModule { }
