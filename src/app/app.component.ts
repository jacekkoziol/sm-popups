import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app works!';

  private onStateChange($ev) {
    console.log('app.component, onStateChange: ', $ev);
  }
}
