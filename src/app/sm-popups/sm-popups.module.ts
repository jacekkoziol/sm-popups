import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayComponent } from './core/overlay/overlay.component';

import { SmToOverlayService } from './services/sm-to-overlay.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [OverlayComponent],
  providers: [
    SmToOverlayService,
  ]
})
export class SmPopupsModule { }
