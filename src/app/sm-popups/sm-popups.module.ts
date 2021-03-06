import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OverlayComponent } from './core/overlay/overlay.component';

import { SmToOverlayDirective } from './directives/sm-to-overlay.directive';
import { ToggleContainerComponent } from './core/toggle-container/toggle-container.component';
import { SmPositionDirective } from './directives/sm-position.directive';
import { TooltipComponent } from './components/tooltip/tooltip.component';
import { SelectComponent } from './components/select/select.component';
import { OptionsListComponent } from './components/options-list/options-list.component';

//import './core/_core.scss';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    OverlayComponent,
    SmToOverlayDirective,
    ToggleContainerComponent,
    SmPositionDirective,
    TooltipComponent,
    SelectComponent,
    OptionsListComponent
  ],
  exports: [
    OverlayComponent,
    //ToggleContainerComponent,
    SmToOverlayDirective,
    //SmPositionDirective,
    TooltipComponent,
    SelectComponent,
    OptionsListComponent
  ],
  providers: []
})
export class SmPopupsModule { }
