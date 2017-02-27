import { Injectable } from '@angular/core';

const STR_OVARLAY_CONTAINER_CSS = 'sm-overlay-container';
const STR_OVERLAY_CONTAINER_ID = 'sm-overlay-main-container';
let overlayContainer = undefined;

@Injectable()
export class SmToOverlayService {

  constructor() {
    console.log('smToOverlay Service');
    alert('test');
    this.createContainerAndAddToBody();
   }

  private createContainerAndAddToBody():void {
    console.log('create overlay');

    if (!overlayContainer) {
      overlayContainer = document.createElement('div')
        .setAttribute('class', STR_OVARLAY_CONTAINER_CSS);

      document.body.appendChild(overlayContainer);
    }
  }

  /*
  private addContainerToBody():void {

  }
  */



}
